import mongoose, { Document, Schema } from "mongoose";

// A Tenant represents an organisation (e.g. a school or university).
// Every user belongs to exactly one tenant.
// tenantId in the JWT identifies which organisation the user belongs to.
export interface ITenant extends Document {
    tenant_id: string;   // UUID — same pattern as subject_id
    name: string;        // Organisation name e.g. "Springfield University"
    isActive: boolean;   // Soft-disable a tenant without deleting data
}

const tenantSchema = new Schema<ITenant>(
    {
        tenant_id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Tenant = mongoose.model<ITenant>("Tenant", tenantSchema);

export default Tenant;
