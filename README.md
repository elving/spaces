# Fisrt time

  npm run setup && npm run task:startServer:dev

# Optimize images

## Spaces

  find . -iname '*.jpeg' -print0 | xargs -0 jpegoptim --max=80 --strip-all --preserve --totals

  find . -iname '*.png' -print0 | xargs -0 optipng -o7 -preserve

## Products

  mogrify -resize 500x> *.jpeg
  find . -iname '*.jpeg' -print0 | xargs -0 jpegoptim --max=80 --strip-all --preserve --totals

  mogrify -resize 500x> *.png
  find . -iname '*.png' -print0 | xargs -0 optipng -o7 -preserve

# Categories and Brands

  mogrify -resize '1300x^>' *.jpeg
  find . -iname '*.jpeg' -print0 | xargs -0 jpegoptim --max=80 --strip-all --preserve --totals

  mogrify -resize '1300x^>' *.png
  find . -iname '*.png' -print0 | xargs -0 optipng -o7 -preserve
