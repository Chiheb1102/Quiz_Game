let count = document.querySelector(".count span");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets")
let spans = document.querySelector(".spans");
let countdown = document.querySelector(".countdown");
let results = document.querySelector(".results");

let currentIndex = 0;
let rights = 0;

function getQuestions() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            let objQst = JSON.parse(this.responseText);
            let objQstlng = objQst.length;
            count.innerHTML = objQstlng;
            createbullets(objQstlng);
            addQstData(objQst[currentIndex], objQst.length);
            countDown(10, objQstlng)
            submitButton.onclick = () => {
                let rightAnswer = objQst[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rightAnswer, objQstlng);
                spans.innerHTML = "";
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                createbullets(objQstlng);
                addQstData(objQst[currentIndex], objQst.length);
                showResults(objQstlng)
                clearInterval(countdownInterval);
                countDown(10, objQstlng)
            }
        }
    }
    req.open("GET", "quiz.json", true);
    req.send();
}
getQuestions();

function createbullets(objQst) {
    count.innerHTML = objQst;
            for(i=0; i<objQst; i++) {
                let span = document.createElement("span");
                span.innerHTML = i+1;
                spans.appendChild(span);
                if(i==currentIndex) {
                    span.className = "on";
                }
            }
}

function addQstData(obj, max) {
    if(currentIndex < max) {
        let h2 = document.createElement("h2");
        h2.textContent = obj.title;
        quizArea.appendChild(h2);

        for(i=1; i<=4; i++) {
            let answer = document.createElement("div");
            answer.className = "answer";
            answersArea.appendChild(answer);

            let input = document.createElement("input");
            input.name = "question";
            input.type = "radio";
            input.id = `answer_${i}`;
            input.dataset.answer = obj[`answer_${i}`];
            answer.appendChild(input);
            if(i==1) {
                input.checked = true;
            }

            let label = document.createElement("label");
            label.textContent = obj[`answer_${i}`];
            label.htmlFor = `answer_${i}`;
            answer.appendChild(label)
        }
    }
}

function checkAnswer(rightAnswer, max) {
    let answers = document.getElementsByName("question");
    let choosenAnswer;
    for(i=0; i<answers.length; i++) {
        if(answers[i].checked) {
            choosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rightAnswer == choosenAnswer) {
        rights++;
    }
}

function showResults(max) {
    if(currentIndex === max){
        quizArea.remove()
        answersArea.remove()
        submitButton.remove()
        bullets.remove()
        if(rights<5) {
            results.classList.add("bad");
        } else if (rights>5 && rights<9) {
            results.classList.add("good");
        } else{
            results.classList.add("perfect");
        }
        results.innerHTML = `You Got ${rights} From ${max}`;
    }
}

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdown.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();
            }
        }, 1000);
    }
}