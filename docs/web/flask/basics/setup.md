# Flask Setup

## 1. Create project structure

```text
my-app/
	app.py
	templates/
	static/
```

## 2. Install Flask

```bash
pip install flask
```

## 3. Create starter app

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
		return 'Hello from Flask'

if __name__ == '__main__':
		app.run(debug=True)
```

## 4. Run app

```bash
python app.py
```

Open `http://127.0.0.1:5000` in browser.
