const gutter = 20;
const slowRate = 30;
const fastRate = 10;
const throttleRange = [
  [ 0, 575 ], [ 1618, 2287 ], [ 2697, 3295 ]
];
const colors = {
  background: '#00bcb9',
  text: '#f9f9f9',
  offblack: '#111111',
  dark: '#75715e',
  selector: '#a6da27',
  key: '#64d9ef',
  value: '#fefefe',
  hex: '#f92772',
  string: '#d2cc70',
  var: '#66d9e0',
  operator: '#f92772',
  method: '#f9245c',
  integer: '#fd971c',
  run: '#ae81ff'
};
const bodySelection = 'document.body';
const codes = [ `\
/*
 * Hello World! 
 *
 * This is Connor!
 * And here I'm telling my story...
 * Long long time ago, in a galaxy far far away....
 */


/*
 * Ok, don't think about that...this is not that
 *
 * I'm just trying hard to put up my resume here.
 */

\

body {
  background-color: ${colors.background}; color: ${colors.text};
  font-size: 13px; line-height: 1.4;
  margin: 0;
  -webkit-font-smoothing: subpixel-antialiased;
}

/*
 * er...I'm Connor, I'm just sitting here and coding.
 * Sure, you can watch, for free.
 *
 * This CSS is being injected into a DOM <style> element 
 * and written in this <pre> element simultaneously.
 * 
 * No idea what's going on?
 * Keep watching!
 */

#my-code {
  overflow: auto;
  position: fixed; width: 70%;
  margin: 0;
  top: ${gutter}px; bottom: ${gutter + 35}px; left: 15%;
}

#my-code {
  transition: left 500ms, width 500ms, opacity 500ms;
  background-color: ${colors.offblack}; color: ${colors.text};
  border: 1px solid rgba(0,0,0,0.2);
  padding: 24px 12px;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 
    0px 0px 0px 1px rgba(255,255,255,0.2),
    0px 4px 0px 2px rgba(0,0,0,0.1);
}

/* 
 * Syntax highlighting 
 * Colors loosely based on Monokai Phoenix
 */

pre em:not(.comment) { font-style: normal; }

.comment       { color: ${colors.dark}; }
.selector      { color: ${colors.selector}; }
.selector .key { color: ${colors.selector}; }
.selector .int { color: ${colors.selector}; }
.key           { color: ${colors.key}; }
.int           { color: ${colors.integer}; }
.hex           { color: ${colors.hex}; }
.hex .int      { color: ${colors.hex}; }
.value         { color: ${colors.value}; }
.var           { color: ${colors.var}; }
.operator      { color: ${colors.operator}; }
.string        { color: ${colors.string}; }
.method        { color: ${colors.method}; }
.run-command   { color: ${colors.run}; }

/* 
 *
 * See? Pretty cool...                        
 *
 */
\`
/* 
 * Let's write some Javascript.             
 * I will write some code and then type '~' to run it.        
 */

/* Let's add a 'h1' element to put "Unicorns" on here. */
var title = document.createElement("h1");
title.id = "title";

/* Now we'll add "Unicorns" to it */
title.innerHTML = "Unicorns, Unicorns, Unicorns!!!";

/* Finally, let's add it to the page */
${bodySelection}.appendChild(title);
             
/* 
 * 
 * Ready?              
 * 
 * Let's run it!              
 * 
 */

 ~                 

/*
 * Awesome! Now we need to position it.
 * We need CSS for that.
 */
\`
#title {
  position: fixed; width: 100%; 
  bottom: 0; left: 0; right: 0;
  font-size: 14px; line-height: 1;
  font-weight: 100; text-align: center;
  padding: 10px; margin: 0;
  z-index: 10;
  background-color: ${colors.offblack};
  border-top: 1px solid rgba(255,255,255,0.2);
  transition: opacity 500ms;
}

#title em {
  font-style: normal;
  color: ${colors.integer};
}                                 
                                             
/*
 * OK, now let me tell a horror story.
 * 
 * Don’t be scared of the monsters, just look for them. 
 * Look to your left, look to your right, under your desk, 
 * behind your monitors, but never look back, 
 * she hates being seen.
 *
 */
                             

/* What is that behind you!? */
                               
/*
 * Scared? Sorry, didn't mean to scare you.
 * Let's do something fun. How about drawing a Pikachu?
 * First, I need move this sh** over here.
 */

#my-code { left: ${gutter}px; width: calc(50% - ${gutter * 1.5}px); }   

BOOM!

\
`
];

// body selector
const $body = document.getElementsByTagName('body')[0];

// easily create element with id
const createElement = function (tag, id) {
  const el = document.createElement(tag);
  if (id) { el.id = id; }
  return el;
};

// create our primary elements
const _style_elem 	= createElement('style', 'style-elem');
const _code_pre 		= createElement('pre',   'my-code');
const _script_area 	= createElement('div',   'script-area');

// append our primary elements to the body
$body.appendChild(_style_elem);
$body.appendChild(_code_pre);
$body.appendChild(_script_area);

// select our primary elements
const $style_elem 	= document.getElementById('style-elem');
const $code_pre 		= document.getElementById('my-code');
const $script_area 	= document.getElementById('script-area');

// tracking states
let openComment = false;
let openInteger = false;
let openString = false;
let prevAsterisk = false;
let prevSlash = false;


// script syntax highlighting logic
const scriptSyntax = function (string, which) {
  // if end of integer (%, ., or px too)
  let s;
  if (openInteger && !which.match(/[0-9\.]/) && !openString && !openComment) {
    s = string.replace(/([0-9\.]*)$/, `<em class="int">$1</em>${which}`);

  // open comment detection
  } else if ((which === '*') && !openComment && prevSlash) {
    openComment = true;
    s = string + which;

  // closed comment detection
  } else if ((which === '/') && openComment && prevAsterisk) {
    openComment = false;
    s = string.replace(/(\/[^(\/)]*\*)$/, '<em class="comment">$1/</em>');

  // var detection
  } else if ((which === 'r') && !openComment && string.match(/[\n ]va$/)) {
    s = string.replace(/va$/, '<em class="var">var</em>');

  // operator detection
  } else if (which.match(/[\!\=\-\?]$/) && !openString && !openComment) {
    s = string + '<em class="operator">' + which + '</em>';

  // pre paren detection
  } else if ((which === '(') && !openString && !openComment) {
    s = string.replace(/(\.)?(?:([^\.\n]*))$/, '$1<em class="method">$2</em>(');

  // detecting quotes
  } else if ((which === '"') && !openComment) {
    s = openString ? string.replace(/(\"[^"\\]*(?:\\.[^"\\]*)*)$/, '<em class="string">$1"</em>') : string + which;

  // detecting run script command ~
  } else if ((which === '~') && !openComment) {
    s = string + '<em class="run-command">' + which + '</em>';

  // ignore syntax temporarily or permanently
  } else {
    s = string + which;
  }

  // return script formatted string
  return s;
};


// style syntax highlighting logic
const styleSyntax = function (string, which) {
  // if end of integer (%, ., or px too), close it and continue
  let preformatted_string, s;
  if (openInteger && !which.match(/[0-9\.\%pxems]/) && !openString && !openComment) {
    preformatted_string = string.replace(/([0-9\.\%pxems]*)$/, '<em class="int">$1</em>');
  } else {
    preformatted_string = string;
  }

  // open comment detection
  if ((which === '*') && !openComment && prevSlash) {
    openComment = true;
    s = preformatted_string + which;

  // closed comment detection
  } else if ((which === '/') && openComment && prevAsterisk) {
    openComment = false;
    s = preformatted_string.replace(/(\/[^(\/)]*\*)$/, '<em class="comment">$1/</em>');

  // wrap style declaration
  } else if (which === ':') {
    s = preformatted_string.replace(/([a-zA-Z- ^\n]*)$/, '<em class="key">$1</em>:');

  // wrap style value
  } else if (which === ';') {
    // detect hex code
    const crazy_reghex = /((#[0-9a-zA-Z]{6})|#(([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){12,14}|([0-9a-zA-Z]|\<em class\=\"int\"\>|\<\/em\>){8,10}))$/;

    // is hex
    if (preformatted_string.match(crazy_reghex)) {
      s = preformatted_string.replace(crazy_reghex, '<em class="hex">$1</em>;');
    // is standard value
    } else {
      s = preformatted_string.replace(/([^:]*)$/, '<em class="value">$1</em>;');
    }

  // wrap selector
  } else if (which === '{') {
    s = preformatted_string.replace(/(.*)$/, '<em class="selector">$1</em>{');

  // ignore syntax temporarily or permanently
  } else {
    s = preformatted_string + which;
  }

  // return style formatted string
  return s;
};


let __js = false;
let _code_block = '';

// write a single character
const writeChar = function (which) {
  // toggle CSS/JS on `
  let char, code_html;
  if (which === '`') {
		// reset it to empty string so as not to show in DOM
    which = '';
    __js = !__js;
  }

  // Using JS
  if (__js) {
    // running a command block. initiated with "~"
    if ((which === '~') && !openComment) {
      const script_tag = createElement('script');
      // two matches based on prior scenario
      const prior_comment_match = /(?:\*\/([^\~]*))$/;
      const prior_block_match = /([^~]*)$/;

      if (_code_block.match(prior_comment_match)) {
        script_tag.innerHTML = _code_block.match(prior_comment_match)[0].replace('*/', '') + '\n\n';
      } else {
        script_tag.innerHTML = _code_block.match(prior_block_match)[0] + '\n\n';
      }

      $script_area.innerHTML = '';
      $script_area.appendChild(script_tag);
    }
    char = which;
    code_html = scriptSyntax($code_pre.innerHTML, char);

  // Using CSS
  } else {
    char = which === '~' ? '' : which;
    $style_elem.innerHTML += char;
    code_html = styleSyntax($code_pre.innerHTML, char);
  }


  // set states
  prevAsterisk = (which === '*');
  prevSlash = (which === '/') && !openComment;
  openInteger = which.match(/[0-9]/) || (openInteger && which.match(/[\.\%pxems]/)) ? true : false;
  if (which === '"') { openString = !openString; }

  // add text to code block variable for regex matching.
  _code_block += which;

  // add character to pre
  return $code_pre.innerHTML = code_html;
};

// write all the chars
const writeChars = function (message, index, interval) {
  if (index < message.length) {
    const faster = [];
    throttleRange.forEach((r) => {
      if (index >= r[0] && index <= r[1]) {
        faster.push(true);
      }
    });
    if (faster.length) {
      interval = slowRate;
    } else {
      interval = fastRate;
    }
    $code_pre.scrollTop = $code_pre.scrollHeight;

    writeChar(message[index++]);
    return setTimeout((() => writeChars(message, index, interval)), interval);
  } else {
    const pikachu 	= createElement('img', 'pikachu');
    pikachu.src = './pikachu.svg';
    pikachu.style.height = '550px';
    pikachu.style.float = 'right';
    setTimeout((() => $body.appendChild(pikachu)), 800);
    const audio = new Audio('./pika4.wav');
    setTimeout((() => audio.play()), 10500);
  }
};

// detect url parameters
const getURLParam = function (key, url) {
  if (typeof url === 'undefined') {
    url = window.location.href;
  }
  const match = url.match(`[?&]${key}=([^&]+)`);
  if (match) { return match[1]; } else { return 0; }
};

// has version parameter?
const _version = getURLParam('billy');
// initiate the script
writeChars(codes[_version], 0, slowRate);