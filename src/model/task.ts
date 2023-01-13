import mongoose from 'mongoose';
const TodoSchema = new mongoose.Schema(
	{
		task: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			required: true,
			enum: ['pending', 'complete', 'in progress'],
			default: 'pending',
		},
	},
    {
      timestamps: true
    },
);
export const Todo = mongoose.model('Todo', TodoSchema);
