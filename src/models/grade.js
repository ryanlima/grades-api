export default (mongoose) => {
	const schema = mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		value: {
			type: Number,
			required: true,
			min: 0,
		},
		lastModified: {
			type: String,
			required: true,
		},
	});

	schema.method("toJSON", function () {
		const { __v, _id, ...object } = this.toObject();

		object.id = _id;

		return object;
	});

	const Grade = mongoose.model("grades", schema, "grades");

	return Grade;
};
