window.Animals = {
    "Tiger":"Тигр",
    "Lion":"Лев",
    "Dog":"Собака",
    "Cat":"Кот",
    "Elephant":"Слон"
};
window.Transport = {
    "Car":"Машина",
    "Bus":"Автобус",
    "Airplane":"Самолет",
    "Train":"Поезд",
    "Motorcycle":"Мотоцикл"
};

function viewWord(showenWord){
    $("#word").html(showenWord);
}
function showStatus(status) {
    $("#info").html(status);
}
function showCount(count, status) {
    $("#counter").html(count);
    if (status === true) {
        $(".CounterDiv").css("background-color","#109748");
    };
    if (status === false) {
        $(".CounterDiv").css("background-color","#CD3531");
    };
    if (status === 3) {
        $(".CounterDiv").css("background-color","#9EC0ED");
    }
}
function showLang(lang) {
    if (lang === 1) {
        $("#word1").html("Русский");
        $("#word2").html("Английский");
    };
    if (lang === 2) {
        $("#word1").html("Английский");
        $("#word2").html("Русский");
    }
}
function arrayRemove(arr, value) { 
        return arr.filter(function(ele){ 
        return ele != value; 
    });
};

let Entered = $("#entered").val();
$("#entered").keypress(function() {
    Entered = $("#entered").val();
});
let choosedPack = $("#packs option:selected").val();

const Game = {
    wordsObject : window[choosedPack],
    stopped : true,
    counter : 0,
    firstLang : true,

    enterWords : Array,
    showWords : Array,

    enterWord : String,
    showWord : String,

    changeLang: function(){
        if ( this.stopped === true) {
            Object.entries(this.wordsObject).forEach( ([key, value]) => {
                //Удаляем данный элемент и создаем новый с противоположными свойствами
                delete this.wordsObject[key];
                this.wordsObject[value] = key;
            });
            this.firstLang = !this.firstLang;
            this.firstLang ? 
            showLang(1) : showLang(2);
        }
        else {
            alert("Игра уже началась. Нельзя менять язык во время нее")
        };
    },
    setArrays : function(){
        this.enterWords = Object.keys( this.wordsObject );
        this.showWords = Object.values( this.wordsObject );
    },
    setWords : function(){
        let wordsLength = this.enterWords.length;
        let randomNum = Math.floor( Math.random() * wordsLength );

        this.enterWord = this.enterWords [ randomNum ];
        this.showWord = this.showWords [ randomNum ];
        
        viewWord(this.showWord);
    },
    deleteWord : function(){
        this.counter++;
        showCount(this.counter,true);
        this.enterWords = arrayRemove( this.enterWords, this.enterWord );
        this.showWords = arrayRemove( this.showWords, this.showWord );
    },
    stop : function(){
        this.stopped = true;
        
    },
    wrong : function(){
        showCount(this.counter, false);
        showStatus(`Ты не угадал,игра закончена.<br>Правильный ответ ${this.enterWord}. Вы ввели "${Entered}"`);
        this.stop();
    },
    checkWord : function(){
        //Неправильно
        if ( Entered != this.enterWord) {
            this.wrong();
        }
        //правильно
        else if( Entered === this.enterWord ) {
            this.deleteWord();
        };
    },
    enter : function(){
        //Проверка слов
        if ( this.stopped != true ) {
            this.checkWord();
        }
        //Проверка победы
        if ( this.enterWords.length === 0 ) {
            showStatus(`Молодец! Ты угадал все слова!`);
            this.stop();
        }
        //В другом случае меняем значения, игра не прекращается
        if ( this.stopped != true ) {
            this.setWords();    
            showStatus(`Верно!`);
            
        }
        //Очищаем строку ввода
        $("#entered").val('');
    },
    start : function(){
        if (this.stopped === false) {
            alert("Игра уже началась");
        }
        else {
            let GameObj = this;
        
            this.counter = 0;
            this.stopped = false;
            this.setArrays();
            this.setWords();
            showCount(this.counter,3);
            viewWord(this.showWord);
            showStatus(`Игра началась. Будьте внимаельнее!`);
        }
        
    }

};
//Запускаем скрипт на слушание кнопок ввода
$("#enter").click( function() {Game.enter();console.log(Entered)} );
$("#entered").keypress(function(key) { if (key.which === 13) {Game.enter();console.log(Entered)}; });

$("#changePack").click(function(){
    if (Game.stopped === true) {
        Game.wordsObject = window[$("#packs option:selected").val()];
    }
    else {
        alert("Игра уже началась. Нельзя менять наборы слов во время нее");
    }
});
$("#change").click(function(){ Game.changeLang() });
$("#start").click(function(){ Game.start() });
$("#entered").on('keyup', function(e) {
    let arr = $(this).val().split('.');
    let result = '';
    for (let x = 0; x < arr.length; x++) {
        result += arr[x].replace(/^\s+/, '').charAt(0).toUpperCase() + arr[x].replace(/^\s+/, '').slice(1) + '. ';
    }
    $(this).val(result.substring(0, result.length - 2));
});
