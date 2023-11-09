/*
 * @LastEditors: lisushuang
 * @Description: 构建结果
 * @FilePath: /bimcc-graph/build.js
 * @Date: 2023-11-09 10:08:35
 * @LastEditTime: 2023-11-09 10:46:14
 * @Author: lisushuang
 */

const execAsync = require('child_process').execSync;
const fs = require('fs');
const globAsync = require('glob').globSync;


async function run() {
  try {
    // 1. 执行Vite构建
    console.log('Building with tsc...');
    await execAsync('yarn tsc');

    // 2. 执行TypeScript编译
    // console.log('Compiling with tsc...');
    // await execAsync('yarn tsc');

    // 3. 删除每个TypeScript输出文件中的console.log语句
    const outputFiles = await globAsync('./build/js/**/*.js');
    outputFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');
      const updatedContent = content.replace(/console\.log\([^;]+;\n?/g, ''); // 删除console.log语句
      fs.writeFileSync(file, updatedContent);
    });

    console.log('Removed console.log statements.');

    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Error during the build process:', error);
  }
}

run();

