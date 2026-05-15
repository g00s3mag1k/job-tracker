import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        role: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        jobUrl: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['saved', 'applied', 'interviewing', 'rejected', 'offer'],
            default: 'saved',
        },
        notes: {
            type: String,
            trim: true,
            default: '',
            maxlength: 1000,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Application || 
    mongoose.model('Application', ApplicationSchema);