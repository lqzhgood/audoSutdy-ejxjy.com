/* eslint-disable no-undef */
const axios = require('axios');
const cheerio = require('cheerio');

const { getVideoDurationInSeconds } = require('get-video-duration');

const { COOKIES } = require('./config.js');

function study(columnId, courseId, studyId, time, videoTime) {
    return axios
        .post(
            'https://www.ejxjy.com/a/onlinelearn/stuCourse/saveVideo',
            new URLSearchParams({
                nowTime: time,
                videoTime,
            }),
            {
                params: {
                    id: studyId,
                },
                headers: {
                    'authority': 'www.ejxjy.com',
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'cache-control': 'no-cache',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'cookie': COOKIES,
                    'dnt': '1',
                    'origin': 'https://www.ejxjy.com',
                    'pragma': 'no-cache',
                    'referer': `https://www.ejxjy.com/a/sys/portal/myCourseDetail.html?courseId=${courseId}&columnId=${columnId}`,
                    'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest',
                },
            },
        )
        .then(({ data }) => {
            if (data.code == '0000') {
                return [null, data];
            } else {
                return [data, null];
            }
        })
        .catch(err => {
            return [err.message, null];
        });
}

function getCurrClass(type = '公需科目', num = 0) {
    let unStudyListSelect;
    let hover = 1;
    let checked = 1;
    switch (type) {
        case '公需科目':
            unStudyListSelect = '#con_a_2 .courseList1 li .courseListB a';
            hover = 1;
            checked = 1;
            break;
        case '专业科目':
            unStudyListSelect = '#con_b_2 .courseList1 li .courseListB a';
            hover = 2;
            checked = 2;
            break;
        case '自选课程':
            unStudyListSelect = '#con_c_2 .courseList1 li .courseListB a';
            hover = 3;
            checked = 3;
            break;
        default:
            throw new Error('未知的科目类型', type);
    }
    return axios
        .get('https://www.ejxjy.com/a/sys/portal/person', {
            params: {
                pageNo: '1',
                pageSize: '5', // 定值
                hover,
                checked,
            },
            headers: {
                'authority': 'www.ejxjy.com',
                'accept':
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'cookie': COOKIES,
                'dnt': '1',
                'pragma': 'no-cache',
                'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            },
        })
        .then(({ data }) => {
            const $ = cheerio.load(data, { decodeEntities: false }, false);
            const aElms = $(unStudyListSelect);
            if (aElms.length == 0) return null;

            const aElm = aElms[num];

            const { href } = aElm.attribs;

            const courseId = href.match(/(?<=courseId=)(.{32})/)[0];
            return courseId;
        });
}

function getClassList(type = '公需科目', pageNo = 1) {
    let unStudyListSelect;
    let hover = 1;
    let checked = 1;
    switch (type) {
        case '公需科目':
            unStudyListSelect = '#con_a_1 .courseList1 li';
            hover = 1;
            checked = 1;
            break;
        case '专业科目':
            unStudyListSelect = '#con_b_1 .courseList1 li';
            hover = 2;
            checked = 2;
            break;
        case '自选课程':
            unStudyListSelect = '#con_c_1 .courseList1 li';
            hover = 3;
            checked = 3;
            break;
        default:
            throw new Error('未知的科目类型', type);
    }
    return axios
        .post(
            'https://www.ejxjy.com/a/sys/portal/person',
            new URLSearchParams({
                pageNo,
                hover,
                pageSize: '5',
                checked,
            }),
            {
                headers: {
                    'authority': 'www.ejxjy.com',
                    'accept':
                        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'cache-control': 'no-cache',
                    'cookie': COOKIES,
                    'dnt': '1',
                    'origin': 'https://www.ejxjy.com',
                    'pragma': 'no-cache',
                    'referer': 'https://www.ejxjy.com/a/sys/portal/person',
                    'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': '1',
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
                },
            },
        )
        .then(({ data }) => {
            const $ = cheerio.load(data, { decodeEntities: false }, false);
            const c = Array.from($(unStudyListSelect)).map(li => {
                const title = $(li).find('h4[title]').attr('title').trim();
                const courseId = $(li)
                    .find('.courseListB a')
                    .attr('href')
                    .match(/(?<=courseId=)(.{32})/)[0];
                return { title, courseId };
            });

            return c;
        });
}

function goToClass(courseId) {
    return axios
        .get('https://www.ejxjy.com/a/sys/portal/myCourseDetail.html', {
            params: {
                courseId,
            },
            headers: {
                'authority': 'www.ejxjy.com',
                'accept':
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'zh-CN,zh;q=0.9',
                'cache-control': 'no-cache',
                'cookie': COOKIES,
                'dnt': '1',
                'pragma': 'no-cache',
                'referer': 'https://www.ejxjy.com/a/sys/portal/person?pageNo=1',
                'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            },
        })
        .then(({ data }) => {
            const $ = cheerio.load(data, { decodeEntities: false }, false);
            const classIdArr = Array.from($('.catalog.menu_body a')).map(elm => {
                return new URLSearchParams(elm.attribs.href).get('columnId');
            });

            return classIdArr;
        });
}

async function getClassTime(courseId, columnId) {
    const { data } = await axios.get('https://www.ejxjy.com/a/sys/portal/myCourseDetail.html', {
        params: {
            courseId,
            columnId,
        },
        headers: {
            'authority': 'www.ejxjy.com',
            'accept':
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            'cookie': COOKIES,
            'dnt': '1',
            'pragma': 'no-cache',
            'referer': `https://www.ejxjy.com/a/sys/portal/myCourseDetail.html?courseId=${courseId}`,
            'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
        },
    });

    // 公共课程才有
    // const $ = cheerio.load(data, { decodeEntities: false }, false);
    // const studyId = $('#studentRuleId').val();

    const [str, studyId] = data.match(/saveVideo\?id=(.{32})/);

    eval(data.match(/var filePath =.+/gim)[0]);
    filePath =
        filePath.indexOf('http://') != -1 || filePath.indexOf('https://') != -1
            ? filePath
            : 'https://media.ejxjy.com:8088' + filePath;

    const duration = await getVideoDurationInSeconds(filePath);

    console.log(studyId, duration);

    return { studyId, duration };
}
module.exports = {
    study,
    getCurrClass,
    getClassList,
    goToClass,
    getClassTime,
};
