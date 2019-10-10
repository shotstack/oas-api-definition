DOCS_DIR=build/docs
mkdir -p $DOCS_DIR
./node_modules/.bin/widdershins --theme dracula --language_tabs --summary api.oas3.json -o $DOCS_DIR/index.html.md
cp $DOCS_DIR/index.html.md .shins/source/index.html.md

cd .shins
node shins.js --logo ../assets/img/logo.png --customCss --minify

cd -

mkdir -p $DOCS_DIR/source/images
cp .shins/index.html ./$DOCS_DIR/.
cp -r .shins/pub ./$DOCS_DIR/.
cp -r .shins/source/images/custom_logo.png ./$DOCS_DIR/source/images/custom_logo.png
cp -r .shins/source/images/navbar.png ./$DOCS_DIR/source/images/navbar.png
cp -r .shins/source/fonts ./$DOCS_DIR/source/fonts

rm ./$DOCS_DIR/index.html.md
