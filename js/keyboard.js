var Keyboard = {
  ascii_tab: []
};

Keyboard.Keymap = {
  forward:      ['z', 'Up',    'ArrowUp'],
  backward:     ['s', 'Down',  'ArrowDown'],
  rotate_left:  ['a', 'Left',  'ArrowLeft'],
  rotate_right: ['e', 'Right', 'ArrowRight'],
  help:         ['h']
};

Keyboard.Clear = function() {
  Keyboard.ascii_tab = [];
};

Keyboard.CheckKey = function(key) {
  return Keyboard.ascii_tab[key];
};

Keyboard.CheckKeymap = function(keymap) {
  for(var i = 0; i < keymap.length; ++i)
    if(Keyboard.ascii_tab[keymap[i]])
      return true;
  return false;
};

Keyboard.SetKey = function(key, b_activated) {
  Keyboard.ascii_tab[key] = b_activated;
};

Keyboard.SetKeyWithKeymap = function(keymap, b_activated) {
  if(keymap.length < 1) {
    alert('Keymap is empty');
    return;
  }
  Keyboard.ascii_tab[keymap[0]] = b_activated;
};
