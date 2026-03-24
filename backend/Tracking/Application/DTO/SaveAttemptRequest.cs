using AutoMapper;
using Tracking.Domain;

namespace Tracking.Application.DTO;

public class SaveAttemptRequest
{
   public Guid UserId { get; set; }
   public Guid BlockId { get; set; }
   public Guid LessonId { get; set; }
   public bool IsCorrect { get; set; }
   public string Answer { get; set; }
   
   
   private class Mapping : Profile
   {
      public Mapping()
      {
         CreateMap<SaveAttemptRequest, AnswerAttempt>();
      }
   }
}