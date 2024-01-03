import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

const eventTypes = [
    {
        "id": 1,
        "description": "User created"
    },
    {
        "id": 2,
        "description": "User deleted"
    },
    {
        "id": 3,
        "description": "Subgroup created"
    },
    {
        "id": 4,
        "description": "Subgroup id changed"
    },
    {
        "id": 5,
        "description": "Subgroup deleted"
    },
    {
        "id": 6,
        "description": "Group created"
    },
    {
        "id": 7,
        "description": "Group deleted"
    },
    {
        "id": 8,
        "description": "User added to group as teacher"
    },
    {
        "id": 9,
        "description": "User added to group as student"
    },
    {
        "id": 10,
        "description": "User added to subgroup as owner"
    },
    {
        "id": 11,
        "description": "User added to subgroup as student"
    },
    {
        "id": 12,
        "description": "User upgraded to teacher of group"
    },
    {
        "id": 13,
        "description": "User downgraded to student of group"
    },
    {
        "id": 14,
        "description": "User removed from group"
    },
    {
        "id": 15,
        "description": "User upgraded to owner of subgroup"
    },
    {
        "id": 16,
        "description": "User downgraded to student of subgroup"
    },
    {
        "id": 17,
        "description": "User removed from subgroup"
    },
    {
        "id": 18,
        "description": "Message contents updated"
    }
]

async function main(){
    for(const type of eventTypes){
        await prisma.eventType.create({
            data: type
        })
    }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)

  })