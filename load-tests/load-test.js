import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = 'http://localhost:5211';

// Обычный пользователь
const USER_PHONE = __ENV.USER_PHONE || '79000000000';
const USER_PASSWORD = __ENV.USER_PASSWORD || '123456';

// Администратор
const ADMIN_PHONE = __ENV.ADMIN_PHONE || '79999999999';
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || '123456';

// Данные для теста
const COURSE_ID = 'a5c12368-1ba4-436e-b91a-df33d325eff7';
const LESSON_ID = '5f3b06d4-6c92-42a1-bbeb-f0ce7613ae88';


const LESSON_BLOCKS_PATH = `/api/lessons/${LESSON_ID}/blocks`;

export const options = {
    scenarios: {
        user_api_load: {
            executor: 'ramping-vus',
            exec: 'userApiScenario',
            startTime: '5s',
            stages: [
                { duration: '15s', target: 10 },
                { duration: '30s', target: 20 },
                { duration: '15s', target: 0 },
            ],
        },

        admin_analytic_load: {
            executor: 'ramping-vus',
            exec: 'adminAnalyticScenario',
            startTime: '10s',
            stages: [
                { duration: '15s', target: 3 },
                { duration: '30s', target: 5 },
                { duration: '15s', target: 0 },
            ],
        },
    },

    thresholds: {
        http_req_failed: ['rate<0.05'],
        checks: ['rate>0.95'],

        'http_req_duration{endpoint:courses}': ['p(95)<800'],
        'http_req_duration{endpoint:tracking_engagement}': ['p(95)<800'],
        'http_req_duration{endpoint:lesson_blocks}': ['p(95)<800'],
        'http_req_duration{endpoint:course_analytic}': ['p(95)<800'],
        'http_req_duration{endpoint:course_progress}': ['p(95)<800'],
    },
};

function extractToken(res) {
    let body;

    try {
        body = res.json();
    } catch {
        return null;
    }

    return (
        body.token ||
        body.accessToken ||
        body.jwtToken ||
        body.data ||
        body.data?.accessToken ||
        body.data?.jwtToken ||
        null
    );
}

function login(loginValue, password, endpointTag = 'login') {
    const payload = JSON.stringify({
        login: loginValue,
        password,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: {
            endpoint: endpointTag,
        },
    };

    const res = http.post(`${BASE_URL}/api/auth/login`, payload, params);
    const authData = extractToken(res);

    check(res, {
        'login setup: status is 200': (r) => r.status === 200,
        'login setup: tokens exist': () => authData !== null,
    });

    return authData;
}

function authHeaders(token, endpointTag) {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        tags: {
            endpoint: endpointTag,
        },
    };
}

export function setup() {
    const userToken = login(USER_PHONE, USER_PASSWORD);
    const adminToken = login(ADMIN_PHONE, ADMIN_PASSWORD);

    if (!userToken) {
        throw new Error('Не удалось получить JWT обычного пользователя');
    }

    if (!adminToken) {
        throw new Error('Не удалось получить JWT администратора');
    }

    return {
        userToken,
        adminToken,
    };
}

export function userApiScenario(data) {
    const token = data.userToken;

    group('GET /api/courses', () => {
        const res = http.get(
            `${BASE_URL}/api/courses`,
            authHeaders(token, 'courses')
        );

        check(res, {
            'courses: status is 200': (r) => r.status === 200,
            'courses: response time < 800ms': (r) => r.timings.duration < 800,
        });
    });

    group('GET /api/progress/courses/{courseId}/lessons', () => {
        const res = http.get(
            `${BASE_URL}/api/progress/courses/${COURSE_ID}/lessons`,
            authHeaders(token, 'course_progress')
        );

        check(res, {
            'course progress: status is 200': (r) => r.status === 200,
            'course progress: response time < 800ms': (r) =>
                r.timings.duration < 800,
        });
    });

    group('GET /api/lessons/{id}/blocks', () => {
        const res = http.get(
            `${BASE_URL}${LESSON_BLOCKS_PATH}`,
            authHeaders(token, 'lesson_blocks')
        );

        check(res, {
            'lesson blocks: status is 200': (r) => r.status === 200,
            'lesson blocks: response time < 800ms': (r) => r.timings.duration < 800,
        });
    });

    group('POST /api/tracking/engagement', () => {
        const payload = JSON.stringify([
                {
                    lessonId: LESSON_ID,
                    id: '71acc925-530e-40fe-8b9a-24de4b1c2d62',
                    totalTimeSpent: Math.floor(Math.random() * 30) + 5
                },
                {
                    lessonId: LESSON_ID,
                    id: 'c7472d9f-45fc-48db-93b7-a382127b68e3',
                    totalTimeSpent: Math.floor(Math.random() * 30) + 5
                },
                {
                    lessonId: LESSON_ID,
                    id: 'fbede606-0a32-497c-b9a0-d70e914417b9',
                    totalTimeSpent: Math.floor(Math.random() * 30) + 5
                },
                {
                    lessonId: LESSON_ID,
                    id: '0d546e17-e716-4aa0-80c8-bd48e42b0b7d',
                    totalTimeSpent: Math.floor(Math.random() * 30) + 5
                },
                {
                    lessonId: LESSON_ID,
                    id: 'c12df0ed-b56d-40ed-81b7-e9d787f82e9c',
                    totalTimeSpent: Math.floor(Math.random() * 30) + 5
                },
            ]
        );

        const res = http.post(
            `${BASE_URL}/api/tracking/engagement`,
            payload,
            authHeaders(token, 'tracking_engagement')
        );

        check(res, {
            'tracking engagement: status is 200 or 202': (r) =>
                r.status === 200 || r.status === 202 || r.status === 204,
            'tracking engagement: response time < 800ms': (r) =>
                r.timings.duration < 800,
        });
    });

    sleep(1);
}

export function adminAnalyticScenario(data) {
    const adminToken = data.adminToken;

    group('GET /api/analytic/progress/courses/{id}', () => {
        const res = http.get(
            `${BASE_URL}/api/analytic/progress/courses/${COURSE_ID}`,
            authHeaders(adminToken, 'course_analytic')
        );

        check(res, {
            'course analytic: status is 200': (r) => r.status === 200,
            'course analytic: response time < 800ms': (r) =>
                r.timings.duration < 800,
        });
    });

    sleep(1);
}