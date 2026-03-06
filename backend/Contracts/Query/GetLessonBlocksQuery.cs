using Contracts.Contracts;
using Core;
using MediatR;

namespace Contracts.Query;

public record GetLessonBlocksQuery(Guid LessonId) : IRequest<Result<List<LessonBlockDto>>>;