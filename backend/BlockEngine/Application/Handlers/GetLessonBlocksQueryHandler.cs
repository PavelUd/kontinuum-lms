using BlockEngine.Application.Interfaces;
using Contracts.Contracts;
using Contracts.Query;
using Core;
using MediatR;

namespace BlockEngine.Application.Handlers;

public class GetLessonBlocksQueryHandler 
    : IRequestHandler<GetLessonBlocksQuery, Result<List<LessonBlockDto>>>
{
    private IBlockService _service;
    
    public GetLessonBlocksQueryHandler(IBlockService service)
    {
        _service = service;
    }

    public async Task<Result<List<LessonBlockDto>>> Handle(GetLessonBlocksQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetBlockByLesson(request.LessonId);
    }
}