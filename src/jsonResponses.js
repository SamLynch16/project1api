/**
 * Helper functions for sending JSON responses (and HEAD responses).
 */

const respondJSON = (req, res, status, object) => {
    res.status(status).json(object);
  };
  
  const respondJSONMeta = (req, res, status) => {
    res.status(status).end();
  };
  
  module.exports = {
    // 200 OK with JSON content
    success: (req, res, content) => {
      respondJSON(req, res, 200, content);
    },
    // 200 OK with no content (HEAD)
    successMeta: (req, res) => {
      respondJSONMeta(req, res, 200);
    },
    // 400 Bad Request
    badRequest: (req, res, message) => {
      respondJSON(req, res, 400, { error: message });
    },
    badRequestMeta: (req, res) => {
      respondJSONMeta(req, res, 400);
    },
    // 404 Not Found
    notFound: (req, res, message) => {
      respondJSON(req, res, 404, { error: message });
    },
    notFoundMeta: (req, res) => {
      respondJSONMeta(req, res, 404);
    },
  };
  