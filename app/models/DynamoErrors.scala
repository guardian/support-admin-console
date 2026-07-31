package models

object DynamoErrors {
  sealed trait DynamoError extends Throwable
  case class DynamoPutError(error: Throwable) extends DynamoError {
    override def getMessage = s"Error writing to Dynamo: ${error.getMessage}"
  }
  case class DynamoNoLockError(error: Throwable) extends DynamoError {
    override def getMessage = s"Error writing to Dynamo: ${error.getMessage}"
  }
  case class DynamoGetError(error: Throwable) extends DynamoError {
    override def getMessage = s"Error reading from Dynamo: ${error.getMessage}"
  }
  case class DynamoNotFoundError(key: String) extends DynamoError {
    override def getMessage = s"Item not found: $key"
  }
  case class DynamoDuplicateNameError(error: Throwable) extends DynamoError {
    override def getMessage = s"Error writing to Dynamo: ${error.getMessage}"
  }
}
