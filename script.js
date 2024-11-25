let spieler_input = document.getElementById("spieler-input")
let imposter_input = document.getElementById("imposter-input")
let imposter_label = document.getElementById("imposter-label")
let spieler_div = document.getElementById("spieler")
let words_form = document.getElementById("words-form")
let custom_word_input = document.getElementById("custom-word-input")
let game = document.getElementById("game")
let menu = document.getElementById("menu")
let header = document.getElementById("header")
let footer = document.getElementById("footer")
let step1 = document.getElementById("step1")
let step2 = document.getElementById("step2")
let step3 = document.getElementById("step3")
let doorbell = document.getElementById("doorbell")
let max_word_lenght = document.getElementById("max-word-lenght")
let word = "Es konnte kein Wort generiert werden"
let custom_words = []
if (localStorage.getItem('words')) {
    custom_words = JSON.parse(localStorage.getItem('words'))
}

function shuffle(array) {
    let currentIndex = array.length
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

let Players = []
if (localStorage.getItem('players')) {
    Players = JSON.parse(localStorage.getItem('players'))
    let _imposter = 0
    Players.forEach(player => {
        if (player.imposter) {
            _imposter ++
            player.imposter = false
        }
        let div = document.createElement('div')
        let button = document.createElement('button')
        let p = document.createElement('p')
        div.classList.add('player_div')
        p.innerText = player.name
        button.innerText = 'delet'
        div.appendChild(p)
        div.appendChild(button)
        spieler_div.appendChild(div)
        button.addEventListener('click', () => {
            spieler_div.removeChild(div)
            Players = Players.filter(_player => _player.name != player.name)
            update_max_Imposters()
        })
        update_max_Imposters()
    })
    imposter_input.value = _imposter
    imposter_input.value > 1 ? imposter_label.innerText = `Imposters: ${imposter_input.value}` : imposter_label.innerText = `Imposter: ${imposter_input.value}`
}

function update_max_Imposters() {
    imposter_input.max = Players.length
}

function add_Player() {
    let name = spieler_input.value
    if (Players.filter(player => player.name == name).length > 0 || name == '') {
        alert('Diesen Spieler gibt es schon oder der Name ist ungülig')
    } else {
        Players.push({name: name, imposter: false})
        let div = document.createElement('div')
        let button = document.createElement('button')
        let p = document.createElement('p')
        div.classList.add('player_div')
        p.innerText = name
        button.innerText = 'delet'
        div.appendChild(p)
        div.appendChild(button)
        spieler_div.appendChild(div)
        button.addEventListener('click', () => {
            spieler_div.removeChild(div)
            Players = Players.filter(player => player.name != name)
            update_max_Imposters()
        })
        update_max_Imposters()
        spieler_input.value = ''
    }
}

spieler_input.addEventListener('keyup', e => {
    if (e.key === "Enter") {
        add_Player()
    }
})

function add_word() {
    if (custom_word_input.value != '') {
        custom_words.push(custom_word_input.value)
        custom_word_input.value = ''
        localStorage.setItem('words', JSON.stringify(custom_words))
    }
}

custom_word_input.addEventListener('keyup', e => {
    if (e.key === "Enter") {
        add_word()
    }
})

imposter_input.addEventListener('input', () => {
    imposter_input.value > 1 ? imposter_label.innerText = `Imposters: ${imposter_input.value}` : imposter_label.innerText = `Imposter: ${imposter_input.value}`
})

function start_Game() {
    localStorage.setItem('players', JSON.stringify(Players))
    if (Players.length > 1 && imposter_input.value <= Players.length) {
        game.style.display = 'grid'
        menu.style.display = 'none'
        header.style.display = 'none'
        footer.style.display = 'none'
        step2.style.display = 'none'
        if (document.getElementById('custom-words').checked) {
            if (custom_words.length > 0) {
                word = custom_words[Math.floor(Math.random() * custom_words.length)]
            } else {
                word = 'Es wurden noch keine Wörter hinzugefügt'
            }
        }
        let imposters = imposter_input.value
        shuffle(Players)
        for (let i = 0; i < imposters; i++) {
            Players[i].imposter = true
        }
        shuffle(Players)
        localStorage.setItem('players', JSON.stringify(Players))
        let index = 0
        let give = false
        document.querySelector('#give_div').style.display = 'block'
        document.querySelector('#role_div').style.display = 'none'
        document.querySelector('#give_div #name').innerText = Players[index].name
        game.addEventListener('click', () => {
            game.classList.remove('imposter')
            game.classList.remove('player')
            if (give && index < Players.length) {
                document.querySelector('#give_div').style.display = 'block'
                document.querySelector('#role_div').style.display = 'none'
                document.querySelector('#give_div #name').innerText = Players[index].name
                give = false
            } else if (index < Players.length) {
                document.querySelector('#give_div').style.display = 'none'
                document.querySelector('#role_div').style.display = 'block'
                give = true
                document.querySelector('#role_div #name').innerText = Players[index].name
                Players[index].imposter ? document.querySelector('#role_div #role').innerText = 'Spion' : document.querySelector('#role_div #role').innerText = 'Spieler'
                Players[index].imposter ? document.querySelector('#role_div #word').innerText = '???' : document.querySelector('#role_div #word').innerText = word
                Players[index].imposter ? game.classList.add('imposter') : game.classList.add('player')
                index ++
            } else {
                step1.style.display = 'none'
                step2.style.display = 'block'
                game.style.pointerEvents = 'none'
                let min = Math.floor(document.getElementById('time').value)
                let sec = Math.floor((Math.floor(document.getElementById('time').value * 100) / 100 - min) * 100)
                let zweiteRunde = false
                let timer = document.getElementById('timer')
                timer.innerText = `${min}:${sec < 10 ? '0' + sec : sec}`
                let interval = setInterval(() => {
                    timer.innerText = `${min}:${sec < 10 ? '0' + sec : sec}`
                    if (sec > 0) {
                        sec --
                    } else if (sec == 0 && min > 0) {
                        sec = 59
                        min --
                    } else {
                        if (zweiteRunde) {
                            clearInterval(interval)
                            doorbell.play()
                            step2.style.display = 'none'
                            step3.style.display = 'block'
                            game.style.pointerEvents = 'all'
                            let imposters = Players.filter(player => player.imposter)
                            step3.innerHTML = 'Spion(e): '
                            imposters.forEach(imposter => {
                                step3.innerHTML += '<br>'
                                step3.innerHTML += imposter.name
                            })
                            step3.innerHTML += '<br><br><button onclick="window.location.reload()">Neue Runde</button><br><br>Das Wort war:<br>' + word
                        } else {
                            zweiteRunde = true
                            min = Math.floor(document.getElementById('vote-time').value)
                            sec = Math.floor((Math.floor(document.getElementById('vote-time').value * 100) / 100 - min) * 100)
                            timer.innerText = `${min}:${sec < 10 ? '0' + sec : sec}`
                            doorbell.play()
                            alert('Jetzt könnt ihr voten...')
                        }
                    }
                }, 1000)
            }
        })
    } else {
        alert('Es gab einen Fehler')
    }
}

var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

function isUppercase(word){
    return /^\p{Lu}/u.test( word );
}

getJSON('https://raw.githubusercontent.com/Jonny-exe/German-Words-Library/master/German-words-1600000-words.json',
    function(err, data) {  
      if (err !== null) {
        alert('Something went wrong: ' + err);
      } else {
        while (true) {
            word = data[Math.floor(Math.random() * data.length)]
            console.log(word);
            
            if (isUppercase(word) && word.length < (max_word_lenght.value > 4 ? max_word_lenght.value : 4)) {break}
        }
      }
    }
  )

  // Credit: https://github.com/Jonny-exe/German-Words-Library/tree/master

function delete_infos() {
    if (window.confirm('Alles löschen?')) {
        localStorage.removeItem('players')
        localStorage.removeItem('words')
        window.location.reload()
    }
}

function toggle_max_word() {
    !document.getElementById('custom-words').checked ? max_word_lenght.style.display = 'block' : max_word_lenght.style.display = 'none'
    !document.getElementById('custom-words').checked ? document.getElementById('max-word-label').style.display = 'block' : document.getElementById('max-word-label').style.display = 'none'
}

toggle_max_word()

max_word_lenght.addEventListener('change', () => {
    window.location.reload()
})