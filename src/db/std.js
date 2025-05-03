import mongoose from "mongoose";

const StdScheme = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required for standard"],
            unique: true,
        },
        subjects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required:false
        }]
    },
    { timestamps: true }
);

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subject name is required"]
    },
    resources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource"
    }]
});

const ResourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Resource Name is Required"]
    },
    type: {
        type: String,
        enum: ['video', 'text', 'document', 'other']
    },
    text: {
        type: String,
        required: function() {
            if (this.type === "text") {
                return true; 
            } else {
                return false;
            }
        }
    },
    url: {
        type: String,
        required: function() {
            if (this.type !== "text") {
                return true; 
            } else {
                return false;
            }
        }
    }
});

const Std = mongoose.model("Standard", StdScheme);
const Subject = mongoose.model("Subject", SubjectSchema);
const Resource = mongoose.model("Resource", ResourceSchema);

export { Std, Subject, Resource };