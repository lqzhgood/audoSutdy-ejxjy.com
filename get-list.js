const fs = require('fs');
const { getClassList, goToClass, getClassTime, study } = require('./lib.js');
const { sleep } = require('./utils.js');

(async () => {
    const gx = await getClass('公需科目');
    const zy = await getClass('专业科目');
    const list = [].concat(gx, zy);
    fs.writeFileSync('./list.json', JSON.stringify({ time: new Date(), list }, null, 4));
})();

async function getClass(type) {
    let list = [];
    let pageNo = 1;
    while (1) {
        try {
            const courseArr = await getClassList(type, pageNo);
            await sleep();
            if (courseArr.length === 0) break;
            pageNo++;
            list = list.concat(courseArr);
        } catch (error) {
            // 500 错误 说明后面没有了
            break;
        }
    }
    console.log(`${type} 数量`, list.length);

    list = list.map(({ title, courseId }) => ({ title, courseId, columns: [] }));

    for (let i = 0; i < list.length; i++) {
        const o = list[i];
        const { title, courseId, columns } = o;
        const columnIdIdArr = await goToClass(courseId);
        await sleep();
        console.log(`${title} 课程数量`, columnIdIdArr.length);

        for (let j = 0; j < columnIdIdArr.length; j++) {
            const columnId = columnIdIdArr[j];
            const { studyId, duration } = await getClassTime(courseId, columnId);
            await sleep();
            columns.push({ columnId, studyId, duration });

            console.log(`${i + 1}/${list.length}`, `${j + 1}/${columnIdIdArr.length}`);

            // 学一次 初始化服务器 studyId 学习时间
            await study(columnId, courseId, studyId, 61);
        }
    }
    return list;
}
