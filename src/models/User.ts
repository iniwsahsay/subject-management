import mongoose, { Document, Schema } from "mongoose";

// Allowed roles — a role is a broad category of what a user can do.
// ADMIN  → full access (create, read, update, delete)
// USER   → read-only access
export type Role = "ADMIN" | "USER";

// Allowed permissions — fine-grained actions a user can perform.
// These are placed directly in the JWT so the middleware can check them
// without an extra database query on every request.
export type Permission =
    | "SUBJECT_CREATE"
    | "SUBJECT_READ"
    | "SUBJECT_UPDATE"
    | "SUBJECT_DELETE";

export interface IUser extends Document {
    user_id: string;           // UUID — consistent with subject_id pattern
    tenant_id: string;         // Which tenant/organisation this user belongs to
    username: string;
    email: string;
    password: string;          // bcrypt hash — never plain text
    roles: Role[];             // Array so a user can have multiple roles
    permissions: Permission[]; // Fine-grained permissions embedded on the user
    isActive: boolean;
}

const userSchema = new Schema<IUser>(
    {
        user_id: {
            type: String,
            required: true,
            unique: true
        },
        tenant_id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        // bcrypt hash stored here — never the raw password
        password: {
            type: String,
            required: true
        },
        roles: {
            type: [String],
            enum: ["ADMIN", "USER"],
            required: true
        },
        permissions: {
            type: [String],
            enum: [
                "SUBJECT_CREATE",
                "SUBJECT_READ",
                "SUBJECT_UPDATE",
                "SUBJECT_DELETE"
            ],
            default: []
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
