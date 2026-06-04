import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  placeOfWork: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  employeeId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Labour'], default: 'Labour' },
  password: { type: String, required: true },
  initialPassword: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
