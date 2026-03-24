using BlockEngine.Application.DTO;

namespace BlockEngine.Application.Interfaces;

public interface IBlockEvaluationService
{
    Task<List<BlockEvaluationResult>> EvaluateAsync(
        List<BlockEvaluateItem> items
    );
}