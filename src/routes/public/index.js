const { Router } = require('express');
const container = require('../../container');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.get('/getAcademyBySubdomain/:subdomain', wrap(async (request, response) => {
  await container.cradle.getAcademyBySubdomainController.handle(request, response);
}));

module.exports = router;