(function () {

    function processQuizzes() {

        const removeCheckBoxes = (node) => {
            const checkBoxes = node.querySelectorAll('input[type=checkbox]')
            for (const checkBox of checkBoxes) {
                checkBox.remove()
            }
            const emptyParas = node.querySelectorAll('p:empty')
            for (const para of emptyParas) {
                para.remove()
            }
        }

        const showQuiz = (element) => {
            // Find the list inside the wrapper
            let quizList = element.querySelector('ul')
            if (!quizList) return
            quizList.classList.add('quiz')

            const questions = quizList.children
            if (questions.length === 0) return

            for (const question of questions) {
                question.classList.add('question')

                const questionLists = question.querySelectorAll('ul')
                // No answers?
                if (!questionLists || questionLists.length === 0) continue

                // ANSWERS ----------------------------------------------------------------

                const answerList = questionLists[0]
                answerList.classList.add('answers')

                const correctAnswers = answerList ? answerList.querySelectorAll('li:has(input:checked)') : null
                if (correctAnswers) {
                    for (const correctAnswer of correctAnswers) {
                        removeCheckBoxes(correctAnswer)
                        correctAnswer.classList.add('answer', 'correct')
                    }
                }

                const wrongAnswers = answerList ? answerList.querySelectorAll('li:has(input:not(:checked))') : null
                if (wrongAnswers) {
                    for (const wrongAnswer of wrongAnswers) {
                        removeCheckBoxes(wrongAnswer)
                        wrongAnswer.classList.add('answer', 'wrong')
                    }
                }

                // FEEDBACK ----------------------------------------------------------------

                const feedbackList = (questionLists.length > 1) ? questionLists[1] : null
                if (feedbackList) feedbackList.classList.add('feedback')

                const correctFeedbacks = feedbackList ? feedbackList.querySelectorAll('li:has(input:checked)') : null
                if (correctFeedbacks) {
                    for (const correctFeedback of correctFeedbacks) {
                        removeCheckBoxes(correctFeedback)
                        correctFeedback.classList.add('feedback-item', 'correct', 'hidden')
                    }
                }

                const wrongFeedbacks = feedbackList ? feedbackList.querySelectorAll('li:has(input:not(:checked))') : null
                if (wrongFeedbacks) {
                    for (const wrongFeedback of wrongFeedbacks) {
                        removeCheckBoxes(wrongFeedback)
                        wrongFeedback.classList.add('feedback-item', 'wrong', 'hidden')
                    }
                }

                // ACTIONS ----------------------------------------------------------------

                if (correctAnswers) {
                    for (const correctAnswer of correctAnswers) {
                        correctAnswer.addEventListener('click', (e) => {
                            answerList.classList.add('revealed')
                            correctAnswer.classList.add('revealed')

                            if (correctFeedbacks) {
                                for (const correctFeedback of correctFeedbacks) {
                                    correctFeedback.classList.remove('hidden')
                                }
                            }
                            if (wrongFeedbacks) {
                                for (const wrongFeedback of wrongFeedbacks) {
                                    wrongFeedback.classList.add('hidden')
                                }
                            }
                        })
                    }
                }

                if (wrongAnswers) {
                    for (const wrongAnswer of wrongAnswers) {
                        wrongAnswer.addEventListener('click', (e) => {
                            answerList.classList.remove('revealed')
                            wrongAnswer.classList.add('revealed')

                            if (wrongFeedbacks) {
                                for (const wrongFeedback of wrongFeedbacks) {
                                    wrongFeedback.classList.remove('hidden')
                                }
                            }
                            if (correctFeedbacks) {
                                for (const correctFeedback of correctFeedbacks) {
                                    correctFeedback.classList.add('hidden')
                                }
                            }
                        })
                    }
                }
            }
        }

        const quizBlocks = document.querySelectorAll('.markdown-section quiz')
        quizBlocks.forEach(quizBlock => {
            showQuiz(quizBlock)
            // Move the quizList out of the wrapper before removing the wrapper
            const quizList = quizBlock.querySelector('ul.quiz')
            if (quizList) {
                quizBlock.parentNode.insertBefore(quizList, quizBlock)
            }
        })
        // Tidy up
        quizBlocks.forEach(quizBlock => quizBlock.remove())
    }

    var docsifyQuizzes = function (hook) {
        hook.doneEach(function () {
            processQuizzes()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyQuizzes, window.$docsify.plugins || [])
})();
