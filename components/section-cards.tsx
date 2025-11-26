import { IconBook, IconPlaylistX, IconShoppingCart, IconTrendingDown, IconTrendingUp, IconUser } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { admingetdashboardState } from "@/app/data/admin/admin-get-dashboard-state"

export async function SectionCards() {

  const {totalCourses,totalLesson,totalSignups,totalcustomers} = await admingetdashboardState()
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
       <div >
       <CardDescription>Total signup</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalSignups}
          </CardTitle>
       </div>
        <div className="flex flex-col items-center gap-y-2">
        <CardAction>
            <Badge variant="outline" className="text-green-600" >
              <IconTrendingUp />
              <div>
                +12.5%
              </div>
            </Badge>
          </CardAction>
          <IconUser className="text-muted-foreground"/>
        </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">register user to the platform</p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
       <div >
       <CardDescription>Total customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalcustomers}
          </CardTitle>
       </div>
        <div className="flex flex-col items-center gap-y-2">
        <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
          <IconShoppingCart className="text-muted-foreground"/>
        </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">user who have enrolled in this course</p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
       <div >
       <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCourses}
          </CardTitle>
       </div>
        <div className="flex flex-col items-center gap-y-2">
        <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
          <IconBook className="text-muted-foreground"/>
        </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Avalaible courses on the platform</p>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
       <div >
       <CardDescription>Total lessons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLesson}
          </CardTitle>
       </div>
        <div className="flex flex-col items-center gap-y-2">
        <CardAction>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
          <IconPlaylistX className="text-muted-foreground"/>
        </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <p className="text-muted-foreground">Learing content avalaible</p>
        </CardFooter>
      </Card>
     
    </div>
  )
}
