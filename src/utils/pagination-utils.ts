import { PaginationRequest } from 'src/proto/events-app';

export function reformatPaginationParams(request:PaginationRequest){
  const query: Record<string, any> = {};
  const requestQuery = request?.query || {};

  if (Object.keys(requestQuery).length > 0) {
    for (const [key, value] of Object.entries(request.query)) {
      if (value) {
        query[key] = { $regex: value, $options: 'i' }; // Case-insensitive regex search
      }
    }
  }

  const { page = 1, limit = 10 } = request;

  const skip = (page - 1) * limit;

  return {query,skip,page,limit}
}