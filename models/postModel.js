const db = require("../db");
const validation = require("./validation");

const postService = {
    // Retrieve all posts
    getAllPosts: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM posts", (err, results) => {
                if (err) {
                    console.error("Error fetching posts:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    // Retrieve a post by ID
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

    // Update a post with dynamic fields
    updatePost: (id, data) => {
        return new Promise((resolve, reject) => {
            let sanitizedData = {};

            // Sanitize and validate required fields
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

            // Ensure at least one field is provided for update
            if (Object.keys(sanitizedData).length === 0) {
                reject("No valid fields provided for update");
                return;
            }

            // Build the update query dynamically
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

    // Create a new post
    createPost: (data) => {
        return new Promise((resolve, reject) => {
            // Validate input data
            const errors = validation.validatePost(data);
            if (errors) {
                reject(errors);
                return;
            }

            // Sanitize input to prevent HTML injection
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

            db.query(insertQuery, [title, content, cover_picture, user_id], (err, result) => {
                if (err) {
                    console.error("Error creating post:", err);
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    },
};

module.exports = postService;
