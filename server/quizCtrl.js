module.exports = {
    getQuizzes: async (req, res) => {
        if (!req || !req.user || !req.user.id) res.status(200).send([])
        let { id } = req.user
        const db = req.app.get('db')
        const quizzes = await db.manyOrNone(`SELECT * FROM QUIZES WHERE USER_ID = $1`, [id])
        res.status(200).send(quizzes)
    },
    newQuiz: async (req, res) => {
        let { id } = req.user
        let { name, info } = req.body
        const db = req.app.get('db')
        const quiz = await db.one(`INSERT INTO quizes (user_id, quiz_name, info) VALUES ($1, $2, $3) RETURNING *`, [id, name, info])
        console.log(quiz)
        res.status(200).send([quiz])
    },
    getQuestions: async (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        const questions = await db.manyOrNone(`SELECT * FROM questions WHERE quiz_id = $1`, [id])
        res.status(200).send(questions)
    },
    deleteQuiz: async (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        const result = await db.result(`DELETE FROM quizes WHERE ID = $1`, [id])
        res.status(200).send(result)
    },
    addQuestion: async (req, res) => {
        let { id, question, answer1, answer2, answer3, answer4, correctAnswer } = req.body;
        const db = req.app.get('db');
        await db.one(`INSERT INTO questions (quiz_id, question, answer1, answer2, answer3, answer4, correctAnswer) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [id, question, answer1, answer2, answer3, answer4, correctAnswer])
        res.status(200).send()
    },
    deleteQuestion: async (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        await db.result(`DELETE FROM questions WHERE ID = $1`, [id])
        res.status(200).send()
    },
    getQuestion: async (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        const question = await db.one(`SELECT * FROM questions WHERE id = $1`, [id])
        console.log(question)
        res.status(200).send([question])
    },
    updateQuestion: async (req, res) => {
        let { id, question, answer1, answer2, answer3, answer4, correctAnswer } = req.body;
        const db = req.app.get('db');
        const result = await db.result(`UPDATE questions SET question = $2, answer1 = $3, answer2 = $4, answer3 = $5, answer4 = $6, correctAnswer = $7 WHERE id = $1`, [id, question, answer1, answer2, answer3, answer4, correctAnswer])
        res.status(200).send(result)
    },
    updateQuiz: async (req, res) => {
        let { id, newName, newInfo } = req.body;
        const db = req.app.get('db');
        const result = await db.result(`UPDATE quizes SET quiz_name = $2, info = $3 WHERE id = $1`, [id, newName, newInfo])
        res.status(200).send(result)
    },
    getQuiz: async (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        const quiz = await db.one(`SELECT * FROM quizes WHERE id = $1`, [id])
        console.log(quiz)
        res.status(200).send([quiz])
    }
}
