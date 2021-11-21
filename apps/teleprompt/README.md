# Teleprompt

## How it works
The input is in the form of a text file or string, containing a block of marked-up text.
The markup consists of two special characters:
- `#n` indicates the start of a new block of 'dialogue', with the `n` indicating which character is talking.
- `{"tag":n}` indicates general formatting, where `n` is a number and `tag` represents a self-closable html tag.

An example:
```
 {"p":3}
 #1
 Hello there. How's it going?
 #2
 Not bad. Thanks for asking.
```
The above input should produce the below markup:
```
<p />
<p />
<p />
<div class="text char1">
 Hello there. How's it going?
</div>
<div class="text char2">
 Not bad. Thanks for asking.
</div>
```