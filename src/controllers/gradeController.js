import { db } from "../models/index.js";
import { logger } from "../config/logger.js";

const Grade = db.grade;

const create = async (req, res) => {
	const { name, subject, type, value } = req.body;
	const lastModified = new Date().toISOString();

	const grade = new Grade({
		name,
		subject,
		type,
		value,
		lastModified,
	});

	try {
		const result = await grade.save(grade);
		res.send({ message: "Grade inserido com sucesso!!!" });
		logger.info(`POST /grade - ${JSON.stringify(result)}`);
	} catch (error) {
		res
			.status(500)
			.send({ message: error.message || "Algum erro ocorreu ao salvar" });
		logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
	}
};

const findAll = async (req, res) => {
	const name = req.query.name;

	//condicao para o filtro no findAll
	let condition = name
		? { name: { $regex: new RegExp(name), $options: "i" } }
		: {};

	try {
		const data = await Grade.find(condition);
		console.log(data);
		if (data.length < 1) {
			return res.status(404).send({ message: "Nenhum grade encontrado" });
		}
		logger.info(`GET /grade`);
		return res.send(data);
	} catch (error) {
		res
			.status(500)
			.send({ message: error.message || "Erro ao listar todos os documentos" });
		logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
	}
};

const findOne = async (req, res) => {
	const { id } = req.params;

	try {
		const data = await Grade.findById({ _id: id });

		if (data.length < 1) {
			return res
				.status(404)
				.send({ message: "Nenhum grade encontrado com o id:" + id });
		}

		res.send(data);
		logger.info(`GET /grade - ${id}`);
	} catch (error) {
		res.status(500).send({ message: "Erro ao buscar o Grade id: " + id });
		logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
	}
};

const update = async (req, res) => {
	if (!req.body) {
		return res.status(400).send({
			message: "Dados para atualizacao vazio",
		});
	}

	const { id } = req.params;
	const { name, subject, type, value } = req.body;
	const lastModified = new Date().toISOString();

	const grade = {
		name,
		subject,
		type,
		value,
		lastModified,
	};
	try {
		const data = await Grade.findByIdAndUpdate({ _id: id }, grade, {
			new: true,
		});

		if (data.length < 1) {
			res
				.status(404)
				.send({ message: "Nenhum Grade encontrado para atualizar" });
		}

		res.send({ message: "Grade atualizado com sucesso", data });

		logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
	} catch (error) {
		res.status(500).send({ message: "Erro ao atualizar a Grade id: " + id });
		logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
	}
};

const remove = async (req, res) => {
	const { id } = req.params;

	try {
		const data = await Grade.findByIdAndDelete({ _id: id });

		if (data.length < 1) {
			return res
				.status(404)
				.send({ message: "Nenhum Grade encontrado para exclusao" });
		}

		res.send({ message: "Grade excluido com sucesso" });
		logger.info(`DELETE /grade - ${id}`);
	} catch (error) {
		res
			.status(500)
			.send({ message: "Nao foi possivel deletar o Grade id: " + id });
		logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
	}
};

const removeAll = async (req, res) => {
	try {
		const data = await Grade.deleteMany();

		if (data.length < 1) {
			return res
				.status(404)
				.send({ message: "Nenhum grade encontrado para exclusao" });
		}
		res.send({
			message: `Grades excluidos`,
		});
		logger.info(`DELETE /grade`);
	} catch (error) {
		res.status(500).send({ message: "Erro ao excluir todos as Grades" });
		logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
	}
};

export default { create, findAll, findOne, update, remove, removeAll };
