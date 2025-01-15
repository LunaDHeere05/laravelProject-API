const db = require("../db");
const bcrypt = require("bcrypt");

const userService = {

    //Een lijst van alle huidige entiteiten ophalen
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

    //Minstens één endpoint waar entiteiten teruggegeven 
    //worden na het zoeken op een waarde van minstens één veld

    //De details een entiteit weergeven
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

    //Een bestaande instantie van de entiteit updaten
    updateUser: (id, data) => {
        return new Promise((resolve, reject) => {
            // Start by sanitizing input to prevent HTML injection
            let sanitizedData = {};
    
            if (data.name && data.name.length >= 3) {
                sanitizedData.name = data.name.replace(/<\/?[^>]+(>|$)/g, "");
            } else {
                reject("Name must be at least 3 characters long");
                return;
            }
    
            if (data.email && /^\S+@\S+\.\S+$/.test(data.email)) {
                sanitizedData.email = data.email.replace(/<\/?[^>]+(>|$)/g, "");
            } else {
                reject("Email must be a valid email address");
                return;
            }
    
            if (data.password && data.password.length >= 6) {
                sanitizedData.password = bcrypt.hashSync(data.password, 10); // Hash the password
            }
    
            if (data.abt_me) {
                sanitizedData.abt_me = data.abt_me.replace(/<\/?[^>]+(>|$)/g, "");
            }
    
            if (data.date_birth) {
                sanitizedData.date_birth = data.date_birth.replace(/<\/?[^>]+(>|$)/g, "");
            }
    
            // Build the SET clause for the SQL query dynamically
            const setFields = [];
            const setValues = [];
    
            // Add each valid field to the query
            Object.keys(sanitizedData).forEach(field => {
                setFields.push(`${field} = ?`);
                setValues.push(sanitizedData[field]);
            });
    
            // Ensure we are updating at least the name, email, and password
            if (!setFields.includes("name = ?")) {
                reject("Name must be provided");
                return;
            }
    
            if (!setFields.includes("email = ?")) {
                reject("Email must be provided");
                return;
            }
    
            if (!setFields.includes("password = ?")) {
                reject("Password must be provided");
                return;
            }
    
            // Append the ID to the values for the WHERE clause
            setValues.push(id);
    
            // SQL query to update the user with dynamic fields
            const updateQuery = `
                UPDATE users 
                SET ${setFields.join(', ')} 
                WHERE id = ?
            `;
    
            // Run the update query
            db.query(updateQuery, setValues, (err, result) => {
                if (err) {
                    console.error("Error updating user:", err);
                    reject(err);
                } else {
                    resolve(result.affectedRows); // Return the number of affected rows
                }
            });
        });
    },
    

      //Een bestaande instantie van de entiteit verwijderen

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

      
      //Een nieuwe instantie van de entiteit toevoegen aan de database
    createUser:(data) => {
        return new Promise((resolve, reject) => {
            console.log(data);
            // Validate input data
            if (!data.name || data.name.length < 3) {
                reject("Name must be at least 3 characters long");
            }
            if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
                reject("Email must be a valid email address");
            }
            if (!data.password || data.password.length < 6) {
                reject("Password must be at least 6 characters long");
            }
    
            // Sanitize input to prevent HTML injection
            const name = data.name.replace(/<\/?[^>]+(>|$)/g, "");
            const email = data.email.replace(/<\/?[^>]+(>|$)/g, "");
            const password = bcrypt.hashSync(data.password, 10); // Hash the password
            const abt_me = data.abt_me ? data.abt_me.replace(/<\/?[^>]+(>|$)/g, "") : null;
            const date_birth = data.date_birth ? data.date_birth.replace(/<\/?[^>]+(>|$)/g, "") : null;
    
            // SQL query to insert a new user
            const insertQuery = `
                INSERT INTO users (name, email, password, abt_me, date_birth) 
                VALUES (?, ?, ?, ?, ?)
            `;
            
            // Run the insert query
            db.query(insertQuery, [name, email, password, abt_me, date_birth], (err, result) => {
                if (err) {
                    console.error("Error creating user:", err);
                    reject(err);
                } else {
                    resolve(result.insertId); // Return the new user ID
                }
            });
        });
  
    }
}
  module.exports = userService;  