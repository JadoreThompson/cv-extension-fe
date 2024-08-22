from flask import Blueprint, render_template, request


views = Blueprint("views", __name__)


@views.route('/', methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.form.get("file")
        print(file)
    return render_template("hello.html")

