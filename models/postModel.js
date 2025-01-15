const db = require("../db");
const validation = require("./validation");

const postService = {
    //all posts
    getAllPosts: (limit = 10, offset = 0) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM posts LIMIT ? OFFSET ?";
        
        db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
            if (err) {
                console.error("Error fetching posts:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
},


    //post by ID
    getPostById: (id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
                if (err) {
                    console.error("Error fetching post:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    // Update post
    updatePost: (id, data) => {
        return new Promise((resolve, reject) => {
            let sanitizedData = {};

            if (data.title) {
                if (data.title.length >= 3) {
                    sanitizedData.title = data.title.replace(/<\/?[^>]+(>|$)/g, "");
                } else {
                    reject("Title must be at least 3 characters long");
                    return;
                }
            }

            if (data.content) {
                sanitizedData.content = data.content.replace(/<\/?[^>]+(>|$)/g, "");
            }

            if (data.cover_picture) {
                sanitizedData.cover_picture = data.cover_picture.replace(/<\/?[^>]+(>|$)/g, "");
            }

            if (Object.keys(sanitizedData).length === 0) {
                reject("No valid fields provided for update");
                return;
            }

            const setFields = [];
            const setValues = [];

            Object.keys(sanitizedData).forEach(field => {
                setFields.push(`${field} = ?`);
                setValues.push(sanitizedData[field]);
            });

            setValues.push(id);

            const updateQuery = `
                UPDATE posts
                SET ${setFields.join(', ')}
                WHERE id = ?
            `;

            db.query(updateQuery, setValues, (err, result) => {
                if (err) {
                    console.error("Error updating post:", err);
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    },

    // Delete a post
    deletePost: (id) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM posts WHERE id = ?", [id], (err, result) => {
                if (err) {
                    console.error("Error deleting post:", err);
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    },

    // Create new post
   // Create new post
createPost: async (data) => {
    try {
        // Await the validation result
        const errors = await validation.validatePost(data);
        if (errors) {
            throw errors; // Throw errors if validation fails
        }

        // Sanitize and prepare the data
        const title = validation.sanitizeString(data.title);
        const content = validation.sanitizeString(data.content);
        const cover_picture = data.cover_picture
            ? validation.sanitizeString(data.cover_picture)
            : null;

        const user_id = data.user_id;

        const insertQuery = `
            INSERT INTO posts (title, content, cover_picture, user_id, created_at, updated_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())
        `;

        return new Promise((resolve, reject) => {
            db.query(insertQuery, [title, content, cover_picture, user_id], (err, result) => {
                if (err) {
                    console.error("Error creating post:", err);
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    } catch (error) {
        console.error("Validation or creation error:", error);
        throw error; // Ensure errors are propagated correctly
    }
},

};

module.exports = postService;
