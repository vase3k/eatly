import fs, { readdirSync, statSync } from 'fs';
import { basename, dirname, extname, join } from 'path';
import sharp from 'sharp';

function convertWebp(options = {}) {
  // Основная функция, принимающая объект настроек
  const inputDir = options.inputDir; // Установка входной директории
  const excludeFolders = options.excludeFolder; // Установка папок, которые нужно исключить, по умолчанию ['meta-images']
  const excludeFilesPrefix = options.excludeFilesPrefix;
  // Установка префиксов файлов, которые нужно исключить
  const quality = options.quality || 80; // Установка качества изображения при конвертации в webp, по умолчанию 80
  const width = options.width || null; // Необязательная ширина для изменения размера изображений, по умолчанию null (без ресайза)
  let totalOriginalBytes = 0; // Инициализация суммы байтов оригинальных изображений
  let totalNewBytes = 0; // Инициализация суммы байтов конвертированных изображений

  function isExcluded(filePath) {
    // Функция для проверки, нужно ли исключить файл
    if (
      excludeFolders.some(
        //meta-image
        (folder) => filePath.startsWith(join(inputDir, folder)) // ('meta-image') => dist.startsWidth('dist/meta-image')
      )
    )
      return true; // Возвращает true, если файл находится в исключённой папке

    const name = basename(filePath); // favicon
    if (excludeFilesPrefix.some((prefix) => name.startsWith(prefix)))
      // "favicon" => favicon.startsWidth('favicon')
      return true; // Возвращает true, если имя файла соответствует исключённому префиксу

    return false; // Иначе файл не исключается
  }

  async function convertFile(filePath) {
    // filepath = 'dist/image.png'
    const ext = extname(filePath).toLowerCase(); // image.PnG = '.png'
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
    // need to be one of 3 extensions.
    //array.includes('.png') = true
    if (isExcluded(filePath)) return;
    //filePath = dist/favicon...

    const outputPath = join(
      // image.png = image.webp
      // Определение пути для файла .webp
      dirname(filePath), // return dist
      basename(filePath, ext) + '.webp'
      // image.png remove .png, add .webp = image.webp
    );

    try {
      const originalSize = statSync(filePath).size;
      // stat.size = 330kb
      // filePath = 'dist/image.png'
      let pipeline = sharp(filePath); // object sharp {'dist/image.png'}
      if (width)
        // width = 1440
        pipeline = pipeline
          .resize({ width, withoutEnlargement: true })
          .toFormat('webp', { quality });
      // means деструктуризация {quality : quality};
      // if width > 1440 = resize, new property to object pipeline

      const data = await pipeline.toBuffer();
      // return object with byte array
      await fs.promises.writeFile(outputPath, data);
      // write bytes array to 'dist/image.webp'
      await fs.promises.unlink(filePath); // Удаление оригинального файла

      const newSize = data.length; // Получение размера webp файла

      totalOriginalBytes += originalSize; // Добавление размера оригинального файла к сумме
      totalNewBytes += newSize; // Добавление размера нового файла к сумме

      const savedPercent = // Расчёт процента сэкономленных байтов
        (((originalSize - newSize) / originalSize) * 100).toFixed(0); // Округление до одного знака после запятой

      console.log(
        // Лог успешной конвертации с информацией о размере
        `✔ converted: ${filePath} → ${outputPath} | ${(
          originalSize /
          1024 /
          1024
        ).toFixed(
          2
        )} MB → ${(newSize / 1024 / 1024).toFixed(2)} MB | saved ${savedPercent}%`
      );
    } catch (err) {
      // Обработка возможных ошибок при конвертации
      console.warn(`✖ error in ${filePath} (${err.message})`); // Лог
      // предупреждения с текстом ошибки
    }
  }

  async function walkDir(dir) {
    // dir = 'dist'
    const files = readdirSync(dir);
    // files = ['assets','meta-images','index.html']
    for (const file of files) {
      // file = 'assets'
      const filePath = join(dir, file); // filePath = 'dist' + 'assets'
      const stats = statSync(filePath);
      // current working directory 'dist/assets' from vite folder.
      // stats = {isDirectory(), isFile, size, mtime}
      if (stats.isDirectory())
        // stats = {isDirectory()} return true
        await walkDir(filePath);
      // if folder = restart function walkDir('dist/assets')
      else await convertFile(filePath); // if not a folder, send
      // 'index.html' to convertFile('dist/index.html')
    }
  }

  function updateHtmlUrls(dir) {
    // Функция для обновления путей к изображениям в HTML
    const files = readdirSync(dir); // array with files and folders in 'dist'
    for (const file of files) {
      // file = 'index.html'
      const filePath = join(dir, file); // filePath = 'dist/index.html'
      const stats = statSync(filePath); // stats = {isDirectory(), isFile, size, mtime}
      if (stats.isDirectory())
        updateHtmlUrls(filePath); // Если папка, рекурсивный вызов функции для обхода вложенных папок
      else if (extname(filePath) === '.html' || extname(filePath) === '.css') {
        // Если файл HTML или CSS, обновление путей к изображениям внутри файла
        let html = fs.readFileSync(filePath, 'utf-8');
        // readFileSync = return string with whole HTML file content
        html = html.replace(/(\.jpg|\.jpeg|\.png)/gi, '.webp'); // Регулярное выражение для замены всех .jpg, .jpeg, .png на .webp
        fs.writeFileSync(filePath, html, 'utf-8'); // Запись обновлённого содержимого обратно в файл
        console.log(`✔ updated HTML: ${filePath}`); // Лог успешного обновления файла
      }
    }
  }

  return {
    name: 'vite-plugin-convert-to-webp',
    async closeBundle() {
      // once build is done, vite will execute closeBundle() function
      await walkDir(inputDir); // Обход входной директории и конвертация изображений
      updateHtmlUrls(inputDir); // Обновление HTML файлов для использования .webp
      // inputDir = 'dist'
      const savedPercent = // Расчёт общего процента сэкономленного веса
        (
          ((totalOriginalBytes - totalNewBytes) / totalOriginalBytes) *
          100
        ).toFixed(1); // Округление до одного знака после запятой
      console.log(
        // 💾 Total: 3.30 MB → 0.38 MB | saved 88.4%
        `\n💾 Total: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB → ${(totalNewBytes / 1024 / 1024).toFixed(2)} MB | saved ${savedPercent}%`
      );
    },
  };
}

export default convertWebp;
