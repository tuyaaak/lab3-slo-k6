 // Чанарын SLO-г endpoint бүрийн k6 threshold-оор шалгах PASS тест

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '2m',
  thresholds: {
    'http_req_duration{name:cart}': ['p(95)<50'],
    'http_req_failed{name:pay}': ['rate<0.08'],
    'http_req_duration{name:report}': ['p(95)<450'],
    checks: ['rate>0.90'],
  },
};

export default function () {
  const base = 'http://localhost:3000';

  const c = http.post(`${base}/cart/add`, null, {
    tags: { name: 'cart' },
  });

  const r = http.get(`${base}/report`, {
    tags: { name: 'report' },
  });

  const p = http.post(`${base}/pay`, null, {
    tags: { name: 'pay' },
  });

  check(c, {
    'cart 200': (res) => res.status === 200,
  });

  check(r, {
    'report 200': (res) => res.status === 200,
  });

  check(p, {
    'pay 200': (res) => res.status === 200,
  });

  sleep(1);
}
