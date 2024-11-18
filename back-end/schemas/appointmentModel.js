import mongoose from 'mongoose';

const appointmentModel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    userInfo: {
      type: Object,
      default: {},
      required: true,
    },
    doctorInfo: {
      type: Object,
      default: {},
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    document: {
      type: Object,
    },
    status: {
      type: String,
      required: true,  // corrected 'require' to 'required'
      default: "pending",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentModel);

export default Appointment;
