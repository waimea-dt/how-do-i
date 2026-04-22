/**
 * docsify-quizzes.js - Builds interactive multiple-choice quizzes from markdown lists.
 *
 * Inside each <quiz> block, checked checkboxes mark correct answers and checked
 * feedback items. The plugin removes authoring checkboxes and wires click behavior.
 *
 * Usage in markdown:
 *   <quiz>
 *
 *   - # 1. Variable Assignment
 *
 *       What will be the value of `x` after executing this code?
 *
 *       ```python
 *       x = 10
 *       x = x + 5
 *       ```
 *
 *       ---
 *
 *       - [ ] 10
 *       - [x] 15
 *       - [ ] 105
 *       - [ ] Error
 *
 *       ---
 *
 *       - [x] **Correct!** The variable `x` starts at 10, then `x + 5` evaluates to 15.
 *
 *           ```python
 *           x = 10    # x is now 10
 *           x = x + 5 # x is now 15
 *           ```
 *
 *       - [ ] **Not quite.** Remember that `x = x + 5` means "take the current value of x, add 5."
 *
 *
 *   - # 2. String Concatenation
 *
 *       What is the output of this code?
 *
 *       ```python
 *       print("Hello" + " " + "Python")
 *       ```
 *
 *       ---
 *
 *       - [ ] HelloPython
 *       - [x] Hello Python
 *       - [ ] Error
 *
 *       ---
 *
 *       - [x] **Perfect!** The `+` operator concatenates strings. The space `" "` is added between them.
 *       - [ ] **Incorrect.** The `+` operator joins strings together.
 *
 *   </quiz>
 *
 * Format:
 *   - Questions: `- # N. Title` followed by question text (can include code blocks)
 *   - Separator: `---` between question, answers, and feedback sections
 *   - Answers: `- [x]` marks correct answer, `- [ ]` for incorrect
 *   - Feedback: `- [x]` shows when correct, `- [ ]` shows when incorrect
 */

(function () {

    function processQuizzes() {

        const removeCheckBoxes = (node) => {
            // Checkbox markers are authoring syntax only; remove them from rendered content.
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
            // Check if first child is a heading (quiz title)
            let quizTitle = null
            const firstChild = element.firstElementChild
            if (firstChild && ['H1', 'H2', 'H3'].includes(firstChild.tagName)) {
                quizTitle = firstChild.textContent
                firstChild.remove()
            }

            // Find the list inside the wrapper
            let quizList = element.querySelector('ul')
            if (!quizList) return
            quizList.classList.add('quiz')

            const questions = quizList.children
            if (questions.length === 0) return

            // Create score tracker
            const totalQuestions = questions.length
            const maxScore = totalQuestions * 3
            const scoreDisplay = document.createElement('div')
            scoreDisplay.className = 'quiz-score'

            let scoreHTML = ''
            if (quizTitle) {
                scoreHTML += `<div class="quiz-title">${quizTitle}</div>`
            }
            scoreHTML += `<div class="score-progress">Progress: <span class="progress-value">0</span> / ${totalQuestions}</div>`
            scoreHTML += `<div class="score-stars">★ <span class="score-value">0</span> / ${maxScore}</div>`
            scoreDisplay.innerHTML = scoreHTML

            // Function to calculate and update total score
            const updateScore = () => {
                let answeredQuestions = 0
                let totalStars = 0
                for (const question of questions) {
                    const correctAnswer = question.querySelector('.answer.correct.revealed')
                    if (correctAnswer) {
                        const wrongRevealed = question.querySelectorAll('.answer.wrong.revealed').length
                        const stars = Math.max(0, Math.min(3, 3 - wrongRevealed))
                        totalStars += stars
                        answeredQuestions++
                    }
                }
                const progressValueElement = scoreDisplay.querySelector('.progress-value')
                progressValueElement.textContent = answeredQuestions

                const scoreValueElement = scoreDisplay.querySelector('.score-value')
                const currentScore = parseInt(scoreValueElement.textContent)
                scoreValueElement.textContent = totalStars

                if (totalStars > currentScore) {
                    // Pulse animation
                    scoreDisplay.classList.remove('pulse')
                    void scoreDisplay.offsetWidth // Force reflow
                    scoreDisplay.classList.add('pulse')
                }
            }

            // Create sentinel to detect sticky state
            const sentinel = document.createElement('div')
            sentinel.className = 'quiz-score-sentinel'

            // Observe sentinel to detect when score block is sticking
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    scoreDisplay.classList.remove('is-sticking')
                } else {
                    scoreDisplay.classList.add('is-sticking')
                }
            }, { threshold: [1] })

            observer.observe(sentinel)

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
                            // Correct answer reveals solution state and hides wrong feedback.
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

                            updateScore()
                        })
                    }
                }

                if (wrongAnswers) {
                    for (const wrongAnswer of wrongAnswers) {
                        wrongAnswer.addEventListener('click', (e) => {
                            // Wrong answer keeps quiz interactive while showing targeted feedback.
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

                            updateScore()
                        })
                    }
                }
            }

            // Add score tracker
            quizList.insertBefore(sentinel, quizList.firstChild)
            quizList.insertBefore(scoreDisplay, quizList.firstChild)
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

