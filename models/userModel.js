const db = require("../db");
const bcrypt = require("bcrypt");
const validation = require("./validation");

const userService = {
    // Get all users
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users", (err, results) => {
                if (err) {
                    console.error("Error fetching users:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    // Get user by ID
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
                if (err) {
                    console.error("Error fetching user:", err);
                    reject(err);
                }
                resolve(results);
            });
        });
    },

    // Get user by date of birth and ID
    getUserByIdBirth_date: (date_birth, id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT * FROM users WHERE DATE(date_birth) = ? AND id = ?", 
                [date_birth, id], 
                (err, results) => {
                    if (err) {
                        console.error("Error fetching user:", err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    },

    // Update user
    updateUser: (id, data) => {
        return new Promise((resolve, reject) => {
            // Validate input data using validation module
            validation.validateUser(data).then(errors => {
                if (errors) {
                    reject(errors); // Reject if validation fails
                    return;
                }

                // Sanitize input data
                let sanitizedData = {
                    name: validation.sanitizeString(data.name),
                    email: validation.sanitizeString(data.email),
                    password: data.password ? bcrypt.hashSync(data.password, 10) : undefined,
                    abt_me: data.abt_me ? validation.sanitizeString(data.abt_me) : null,
                    date_birth: data.date_birth ? validation.sanitizeString(data.date_birth) : null
                };

                // Filter out undefined values (e.g., if password is not updated)
                sanitizedData = Object.fromEntries(Object.entries(sanitizedData).filter(([_, v]) => v !== undefined));

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
                    UPDATE users
                    SET ${setFields.join(', ')}
                    WHERE id = ?
                `;

                db.query(updateQuery, setValues, (err, result) => {
                    if (err) {
                        console.error("Error updating user:", err);
                        reject(err);
                    } else {
                        resolve(result.affectedRows);
                    }
                });
            }).catch(err => reject(err));
        });
    },

    // Delete user
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
                if (err) {
                    console.error("Error deleting user:", err);
                    reject(err);
                } else {
                    resolve(result.affectedRows);
                }
            });
        });
    },

    // Create user
    createUser: (data) => {
        return new Promise((resolve, reject) => {
            // Validate input data using validation module
            validation.validateUser(data).then(errors => {
                if (errors) {
                    reject(errors); // Reject if validation fails
                    return;
                }

                // Sanitize input data
                const name = validation.sanitizeString(data.name);
                const email = validation.sanitizeString(data.email);
                const password = bcrypt.hashSync(data.password, 10); // Hash password
                const abt_me = data.abt_me ? validation.sanitizeString(data.abt_me) : null;
                const date_birth = data.date_birth ? validation.sanitizeString(data.date_birth) : null;

                // Insert new user into the database
                const insertQuery = `
                    INSERT INTO users (name, email, password, abt_me, date_birth)
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(insertQuery, [name, email, password, abt_me, date_birth], (err, result) => {
                    if (err) {
                        console.error("Error creating user:", err);
                        reject(err);
                    } else {
                        resolve(result.insertId); // Return the new user ID
                    }
                });
            }).catch(err => reject(err));
        });
    }
};

module.exports = userService;
