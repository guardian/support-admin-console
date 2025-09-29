package services.promo

import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import com.typesafe.scalalogging.StrictLogging

class DynamoPromoCampaigns(stage: String, client: DynamoDbClient) 
    extends DynamoService(stage, client) 
    with StrictLogging {

    protected val tableName = s"support-admin-console-promo-campaigns-$stage"
    
}