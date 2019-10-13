# Script executor for [Runnerty]:

### Configuration sample:

```json
{
  "id": "scriptdefault",
  "type": "@runnerty-executor-script"
}
```

### Plan sample:

```json
{
  "id": "script_default",
  "script": "return('hello');"
}
```

```json
{
  "id": "script_default",
  "script_file": "my_script.js",
  "args": { "my_const": "Y", "my_key": "@GV(MY_KEY)" }
}
```

```json
{
  "id": "script_default",
  "script": "let res=''; if(args.my_const === 'Y'){res=args.my_key} return(res);",
  "args": { "my_const": "Y", "my_key": "@GV(MY_KEY)" }
}
```

### if you create a function that returns an object or array it will be automatically (JSON.stringify) saved in `PROCESS_EXEC_[KEY_NAME]`:

```js
return { KEY_ONE: "VAL_ONE", KEY_TWO: "VAL_TWO" };
```

```json
{
  "output_share": [
    { "key": "VALUE", "name": "ONE", "value": "@GV(PROCESS_EXEC_KEY_ONE)" },
    { "key": "VALUE", "name": "TWO", "value": "@GV(PROCESS_EXEC_KEY_TWO)" }
  ]
}
```

[runnerty]: http://www.runnerty.io
