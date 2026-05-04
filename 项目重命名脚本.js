#!/usr/bin/env node

/**
 * 项目重命名脚本
 * 用于批量替换项目中的 NativeRouter/nativerouter 为新的项目名称
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 需要替换的文件列表（排除 node_modules、build 等目录）
const FILES_TO_UPDATE = [
  'package.json',
  'package-lock.json',
  'app.json',
  'tsconfig.json',
  'rspack.config.mjs',
  'README.md',
  'TEMPLATE_GUIDE.md',
  'scripts/build-android.sh',
  'scripts/build-android-repack.sh',
  'ios/Podfile',
  'ios/NativeRouter.xcodeproj/project.pbxproj',
  'ios/NativeRouter.xcodeproj/xcshareddata/xcschemes/NativeRouter.xcscheme',
  'ios/NativeRouter/AppDelegate.swift',
  'ios/NativeRouter/Info.plist',
  'ios/NativeRouter/LaunchScreen.storyboard',
  'android/settings.gradle',
  'android/app/build.gradle',
  'android/app/src/main/res/values/strings.xml',
  'android/app/src/main/java/com/nativerouter/MainActivity.kt',
  'android/app/src/main/java/com/nativerouter/MainApplication.kt',
];

// 需要重命名的目录和文件
const PATHS_TO_RENAME = [
  'ios/NativeRouter',
  'ios/NativeRouter.xcodeproj',
  'ios/NativeRouter.xcodeproj/xcshareddata/xcschemes/NativeRouter.xcscheme',
  'android/app/src/main/java/com/nativerouter',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

/**
 * 转换为 kebab-case 格式 (my-project)
 */
function toKebabCase(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 转换为 Java 包名安全格式 (myproject)
 * Java 标识符不允许连字符，去掉所有非字母数字字符
 */
function toJavaPackage(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1$2')
    .replace(/[-\s_]+/g, '')
    .toLowerCase();
}

/**
 * 转换为 PascalCase 格式 (MyProject)
 */
function toPascalCase(name) {
  return name
    .replace(/[-\s_](.)/g, (match, c) => c.toUpperCase())
    .replace(/^./, c => c.toUpperCase());
}

/**
 * 转换为 camelCase 格式 (myProject)
 */
function toCamelCase(name) {
  const pascal = toPascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * 替换文件内容
 */
function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在，跳过: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [oldValue, newValue] of Object.entries(replacements)) {
    if (content.includes(oldValue)) {
      content = content.replaceAll(oldValue, newValue);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ 已更新: ${filePath}`);
    return true;
  }

  return false;
}

/**
 * 重命名文件或目录
 */
function renamePath(oldPath, newPath) {
  if (!fs.existsSync(oldPath)) {
    console.log(`⚠️  路径不存在，跳过: ${oldPath}`);
    return false;
  }

  const dir = path.dirname(newPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.renameSync(oldPath, newPath);
  console.log(`✓ 已重命名: ${oldPath} -> ${newPath}`);
  return true;
}

/**
 * 主函数
 */
async function main() {
  console.log('\n========================================');
  console.log('    React Native 项目重命名工具');
  console.log('========================================\n');
  console.log('⚠️  此操作将修改项目中的多个文件，请确保已提交代码或做好备份！\n');

  const projectName = await question('请输入新的项目名称 (例如: TabletOrdering): ');

  if (!projectName || projectName.trim().length === 0) {
    console.log('\n❌ 项目名称不能为空');
    rl.close();
    process.exit(1);
  }

  const kebabCase = toKebabCase(projectName);
  const pascalCase = toPascalCase(projectName);
  const camelCase = toCamelCase(projectName);
  const javaPackage = toJavaPackage(projectName);

  console.log('\n----------------------------------------');
  console.log('名称转换预览:');
  console.log(`  Kebab-case:  ${kebabCase}`);
  console.log(`  PascalCase:  ${pascalCase}`);
  console.log(`  camelCase:   ${camelCase}`);
  console.log(`  Java包名:    ${javaPackage}`);
  console.log('----------------------------------------\n');

  const confirm = await question('确认执行重命名操作？(yes/no): ');

  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('\n❌ 操作已取消');
    rl.close();
    process.exit(0);
  }

  console.log('\n🚀 开始重命名...\n');

  // 替换方案
  // 注意：Android 包名（namespace/applicationId）必须使用 javaPackage，
  // 因为 Java 标识符不允许连字符（如 com.hotel-repack 是非法的）
  const replacements = {
    'NativeRouter': pascalCase,
    'nativerouter': javaPackage,
    'native-router': kebabCase,
    'nativeRouter': camelCase,
    'TabletOrdering': pascalCase,
    'HotelRepack': pascalCase,
  };

  let successCount = 0;
  let renameCount = 0;

  // 1. 替换文件内容
  console.log('📝 替换文件内容...\n');
  for (const file of FILES_TO_UPDATE) {
    if (replaceInFile(file, replacements)) {
      successCount++;
    }
  }

  // 2. 重命名目录和文件
  console.log('\n📁 重命名目录和文件...\n');

  // iOS 项目重命名
  const oldIOSName = 'NativeRouter';
  const newIOSName = pascalCase;

  const oldIOSDir = path.join('ios', oldIOSName);
  const newIOSDir = path.join('ios', newIOSName);
  if (fs.existsSync(oldIOSDir)) {
    renamePath(oldIOSDir, newIOSDir);
    renameCount++;
  }

  const oldXcodeproj = path.join('ios', `${oldIOSName}.xcodeproj`);
  const newXcodeproj = path.join('ios', `${newIOSName}.xcodeproj`);
  if (fs.existsSync(oldXcodeproj)) {
    renamePath(oldXcodeproj, newXcodeproj);
    renameCount++;

    // 重命名 xcscheme 文件
    const oldXcscheme = path.join(newXcodeproj, 'xcshareddata', 'xcschemes', `${oldIOSName}.xcscheme`);
    const newXcscheme = path.join(newXcodeproj, 'xcshareddata', 'xcschemes', `${newIOSName}.xcscheme`);
    if (fs.existsSync(oldXcscheme)) {
      renamePath(oldXcscheme, newXcscheme);
      renameCount++;
    }
  }

  // Android 包名重命名
  // 使用 javaPackage（无连字符）而非 kebabCase，确保 Java 包名合法
  const oldAndroidPackage = 'nativerouter';
  const newAndroidPackage = javaPackage;

  const oldAndroidDir = path.join('android', 'app', 'src', 'main', 'java', 'com', oldAndroidPackage);
  const newAndroidDir = path.join('android', 'app', 'src', 'main', 'java', 'com', newAndroidPackage);

  if (fs.existsSync(oldAndroidDir)) {
    // 创建新目录结构
    if (!fs.existsSync(newAndroidDir)) {
      fs.mkdirSync(newAndroidDir, { recursive: true });
    }

    // 移动所有 .kt 和 .java 文件
    const files = fs.readdirSync(oldAndroidDir);
    for (const file of files) {
      if (file.endsWith('.kt') || file.endsWith('.java')) {
        const oldFilePath = path.join(oldAndroidDir, file);
        const newFilePath = path.join(newAndroidDir, file);
        fs.renameSync(oldFilePath, newFilePath);

        // 更新文件中的 package 声明
        let content = fs.readFileSync(newFilePath, 'utf8');
        content = content.replace(
          new RegExp(`package com\\.\\w+`, 'g'),
          `package com.${newAndroidPackage}`
        );
        fs.writeFileSync(newFilePath, content);
        console.log(`✓ 已移动并更新: ${newFilePath}`);
        renameCount++;
      }
    }

    // 删除旧目录
    fs.rmdirSync(oldAndroidDir);
  }

  // 3. 清理 Android 构建缓存
  // 重命名后 build/ 目录下的自动生成文件（如 ReactNativeApplicationEntryPoint.java）
  // 仍引用旧包名，必须清理否则编译失败
  console.log('\n🧹 清理 Android 构建缓存...\n');
  const buildDir = path.join('android', 'app', 'build');
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log('✓ 已删除: android/app/build');
  }
  const rootBuildDir = path.join('android', 'build');
  if (fs.existsSync(rootBuildDir)) {
    fs.rmSync(rootBuildDir, { recursive: true, force: true });
    console.log('✓ 已删除: android/build');
  }

  // 4. 清理 Android assets 中的旧 bundle 文件
  console.log('\n🧹 清理 Android bundle 文件...\n');
  const assetsDir = path.join('android', 'app', 'src', 'main', 'assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    let cleanedCount = 0;
    for (const file of files) {
      if (file.endsWith('.bundle') || file.endsWith('.bundle.map') || file.endsWith('.pack')) {
        const filePath = path.join(assetsDir, file);
        fs.unlinkSync(filePath);
        console.log(`✓ 已删除: ${filePath}`);
        cleanedCount++;
      }
    }
    if (cleanedCount > 0) {
      renameCount += cleanedCount;
    } else {
      console.log('ℹ️  没有找到需要清理的 bundle 文件');
    }
  }

  console.log('\n========================================');
  console.log('✨ 重命名完成！');
  console.log('========================================');
  console.log(`📊 统计:`);
  console.log(`   - 更新文件: ${successCount} 个`);
  console.log(`   - 重命名路径: ${renameCount} 个`);
  console.log('\n📌 后续步骤:');
  console.log('   1. 运行 cd ios && pod install (如果使用 iOS)');
  console.log('   2. 运行 npm install');
  console.log('   3. 检查并更新 README.md 中的项目描述');
  console.log('   4. 在 Xcode 中打开项目，检查 Bundle Identifier');
  console.log('   5. 在 Android Studio 中打开项目，检查 applicationId');
  console.log('   6. Android 构建缓存已自动清理，首次构建会较慢');
  console.log('');
  rl.close();
}

main().catch(err => {
  console.error('\n❌ 发生错误:', err.message);
  rl.close();
  process.exit(1);
});
