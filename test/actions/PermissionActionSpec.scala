package actions

import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import play.api.http.Status
import services.UserPermissions
import services.UserPermissions.Permission
import play.api.test.Helpers._

import scala.concurrent.Future

class PermissionActionSpec extends AsyncFlatSpec with Matchers {

  private val page = "support-landing-page-tests"

  private val permissions = Map(
    "no-permission@guardian.co.uk" -> Nil,
    "read-permission@guardian.co.uk" -> List(UserPermissions.PagePermission(page, Permission.Read)),
    "write-permission@guardian.co.uk" -> List(UserPermissions.PagePermission(page, Permission.Write))
  )

  it should "return 403 if no permissions for user" in {
    val email = "mr.test@guardian.co.uk"
    val result = PermissionAction.checkPermission(
      email,
      page,
      Permission.Write,
      None
    ).get
    status(Future.successful(result)) should be(Status.FORBIDDEN)
    contentAsString(Future.successful(result)) should be(s"No permissions found for user ${email}")
  }

  it should "return 403 if no permission for that page for user" in {
    val email = "no-permission@guardian.co.uk"
    val result = PermissionAction.checkPermission(
      email,
      page,
      Permission.Write,
      permissions.get(email)
    ).get
    status(Future.successful(result)) should be(Status.FORBIDDEN)
    contentAsString(Future.successful(result)) should be(s"No permission found for user ${email}, for page $page")
  }

  it should "return 403 if user only has Read permission" in {
    val email = "read-permission@guardian.co.uk"
    val result = PermissionAction.checkPermission(
      email,
      page,
      Permission.Write,
      permissions.get(email)
    ).get
    status(Future.successful(result)) should be(Status.FORBIDDEN)
    contentAsString(Future.successful(result)) should be(s"Invalid permission for user ${email}, for page $page")
  }

  it should "return None if user has Write permission" in {
    val email = "write-permission@guardian.co.uk"
    PermissionAction.checkPermission(
      email,
      page,
      Permission.Write,
      permissions.get(email)
    ) should be(None)
  }
}
