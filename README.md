<p style="display:flex;align-items:center;gap:10px;justify-content:center">
   <img width="120" src="https://cdn.icon-icons.com/icons2/2699/PNG/512/yaml_logo_icon_169687.png" alt="YAML logo">
   <img  height="70" src="https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png" alt="YAML logo">
</p>

<br/>

# YML-INCLUDE

The yml-include library is a simple and efficient solution for developers working with YAML files. It allows for easy management of YAML file inclusions, which simplifies configuration management and reuse of code fragments.

## Getting started

You can easily install yml-include using this command

```bash
npm install yml-include -D
```

## Use

Once installed yml-include is used with this single command

```bash
npx yml-include <entry_file.yml> <dist_file.yml>
```

This will start a build of your YAML files

You can add the `--watch` parameter to make yml-include rebuild when saving an included file

```bash
npx yml-include <entry_file.yml> <dist_file.yml> --watch
```

Or you can defined a script in your `package.json` to run `npm run <your_script_name>`

```json
  "scripts":{
    "build-yml": "yml-include <entry_file.yml> <dist_file.yml>"
    "watch-yml": "yml-include <entry_file.yml> <dist_file.yml> --watch"
  }
```

## Syntaxes

There are two syntaxes specific to the yml-include library
`#@include <relative_path>` & `#@slot:<slot_name> <value>`

### @include

> Syntax `@include <relative_path>`

The use of `@include` allows to include the content of another YAML file, this one needs a relative path to the desired `.yml` file, there is no need to specify the `.yml` extension

_Example_

`./entry-docker-compose.yml`

```yaml
services:
  database:
    image: mysql
  #@include ./services/nginx
```

`./services/nginx.yml`

```yaml
web:
  image: nginx
```

`out-docker-compose.yml`

```yaml
services:
  database:
    image: mysql
  web:
    image: nginx
```

### @slot

> Syntax `@slot:slot_name <value>`

Combined with an `@include` the `@slot` allows to interpolate a value in the included file, let's use the same example as before

_example_

`./entry-docker-compose.yml`

```yaml
services:
  database:
    image: mysql
  #@include ./services/nginx
  #@slot:image_version nginx:latest
```

`./services/nginx.yml`

```yaml
web:
  image: #@slot:image_version
```

`out-docker-compose.yml`

```yaml
services:
  database:
    image: mysql
  web:
    image: nginx:latest
```

This allows you to create some kind of reusable YAML component.

## Features

### Error Management

In case of error on imported files, the script shows you the line and the file concerned by the erroneous include

### File Caching

The purpose of this script is to simplify the writing of large YAML files by allowing multiple use of the same include from the same or another file. The script caches all open files to preserve access to your hard disk.

### In the futur

- Prevent from circular include cause infinit loop
- Add warning about syntax close to basic yml-include syntax (#@)
