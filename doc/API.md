# API overview

Base path: `/api`. Authenticated mutations require a session cookie plus `X-CSRF-Token`. JSON errors use
`{"error":{"code","message"}}`. Pagination uses `page`, `perPage`, and returns `items/page/perPage/total/totalPages`.

## Auth

| Method | Path |
|---|---|
| GET | `/setup/status` |
| POST | `/setup` |
| POST | `/auth/login` |
| POST | `/auth/register` |
| POST | `/auth/logout` |
| GET | `/auth/me` |
| PATCH | `/auth/me` |
| POST | `/auth/password` |
| POST | `/auth/verify-email` |
| POST | `/auth/resend-verification` |

## Models

| Method | Path |
|---|---|
| GET | `/models` (`q,category,tag,fileType,sort,page,perPage,featured,mine,owner`) |
| GET | `/models/{id}` |
| POST | `/models` |
| PATCH | `/models/{id}` |
| DELETE | `/models/{id}` |
| POST | `/models/{id}/files` (multipart `file`) |
| DELETE | `/models/{id}/files/{fileID}` |
| POST | `/models/{id}/images` (multipart `file`, optional `?kind=render`) |
| DELETE | `/models/{id}/images/{imageID}` |
| POST | `/models/{id}/attachments` (multipart `file`) |
| DELETE | `/models/{id}/attachments/{attachmentID}` |
| GET | `/models/{id}/attachments/{attachmentID}/content?download=1` |
| GET | `/models/{id}/files/{fileID}/content?download=1` |
| GET | `/models/{id}/images/{imageID}/{original|large|thumb}` |
| POST/DELETE | `/models/{id}/like` |
| POST/DELETE | `/models/{id}/bookmark` |
| PUT/DELETE | `/models/{id}/rating` |
| GET/POST | `/models/{id}/comments` |
| PATCH/DELETE | `/comments/{id}` |
| GET | `/models/{id}/related` |
| GET | `/models/{id}/collections` |

## Discovery / users

| Method | Path |
|---|---|
| GET | `/categories` |
| GET | `/tags` |
| GET | `/tags/{slug}` |
| GET | `/tags/{slug}/models` |
| GET | `/collections` |
| POST | `/collections` |
| GET/PATCH/DELETE | `/collections/{id}` |
| POST/DELETE | `/collections/{id}/models/{modelId}` |
| PATCH | `/collections/{id}/models` |
| GET | `/users/{username}` |
| GET | `/users/{username}/models` |
| GET | `/users/{username}/collections` |
| GET | `/creators` |
| GET | `/stats` |

## Admin

| Method | Path |
|---|---|
| GET | `/admin/stats` |
| GET | `/admin/users` |
| PATCH/DELETE | `/admin/users/{id}` |
| GET | `/admin/models` |
| PATCH/DELETE | `/admin/models/{id}` |
| GET | `/admin/comments` |
| DELETE | `/admin/comments/{id}` |
| DELETE | `/admin/ratings/{userId}/{modelId}` |
| GET | `/admin/collections` |
| DELETE | `/admin/collections/{id}` |
| GET/PATCH | `/admin/settings` |
| POST | `/admin/smtp/test` |
| GET | `/admin/audit` |
| GET | `/admin/storage` |

## Notes

- Model visibility is enforced on metadata, comments, and every media byte.
- STEP/STP is rejected in v1.
- Supported model formats: STL, 3MF, OBJ, PLY, GLB, GLTF.
- Public model media is cacheable; members/private media is private-cache only.
