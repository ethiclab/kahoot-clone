module.exports = {
    getQuizzes: async (req, res) => {
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
    deleteQuiz: (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        db.delete_quiz([id])
            .then(result => res.status(200).send(result))
            .catch(err => res.status(500).send(err))
    },
    addQuestion: async (req, res) => {
        let { id, question, answer1, answer2, answer3, answer4, correctAnswer } = req.body;
        const db = req.app.get('db');
        await db.one(`INSERT INTO questions (quiz_id, question, answer1, answer2, answer3, answer4, correctAnswer) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [id, question, answer1, answer2, answer3, answer4, correctAnswer])
        res.status(200).send()
    },
    deleteQuestion: (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        db.delete_question([id])
            .then(() => res.status(200).send())
            .catch(err => res.status(500).send(err))
    },
    getQuestion: (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        db.get_question([id])
            .then(result => res.status(200).send(result))
            .catch(err => res.status(500).send(err))
    },
    updateQuestion: (req, res) => {
        let { id, question, answer1, answer2, answer3, answer4, correctAnswer } = req.body;
        const db = req.app.get('db');
        db.update_question([id, question, answer1, answer2, answer3, answer4, correctAnswer])
            .then(result => res.status(200).send(result))
            .catch(err => res.status(500).send(err))
    },
    updateQuiz: (req, res) => {
        let { id, newName, newInfo } = req.body;
        const db = req.app.get('db');
        db.update_quiz([id, newName, newInfo])
            .then(result => res.status(200).send(result))
            .catch(err => res.status(500).send(err))
    },
    getQuiz: (req, res) => {
        let { id } = req.params;
        const db = req.app.get('db');
        db.get_quiz([id])
            .then(result => res.status(200).send(result))
            .catch(err => res.status(500).send(err))
    }
}
