import mongoose from "mongoose";

const remarkSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['Rectification', 'Identification'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const submissionSchema = new mongoose.Schema({
  labour: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formType: { type: String, enum: ['Eyewash', 'Forklift', 'Site Safety'], required: true },
  status: { type: String, enum: ['Pending', 'Reviewed'], default: 'Pending' },
  formData: { type: mongoose.Schema.Types.Mixed, required: true },
  remarks: [remarkSchema]
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
