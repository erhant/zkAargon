from enum import Enum

class ITEM(Enum):
    EMPTY = 0
    WALL = 1
    BOMB = 2
    TARGET = 3
    MIRROR = 4
    SOURCE = 5
    SPLIT = 6
    SCATTER = 7

class DIR(Enum):
  TOP_LEFT = 0
  TOP = 1
  TOP_RIGHT = 2
  RIGHT = 3
  BOTTOM_RIGHT = 4
  BOTTOM = 5
  BOTTOM_LEFT = 6
  LEFT = 7


def getNeighboursFromNewOutsAndGetTheirInputs(current_item_index, n, new_outs):
    i = int(current_item_index / n)
    j = current_item_index % n

    neighbourConnectionMap = {(-1,-1): 0, (-1,0): 1, (-1,1): 2, (0,1): 3, (1,1): 4, (1,0): 5, (1,-1): 6, (0,-1): 7}

    res = []
    for ii in [-1,0,1]:
        for jj in [-1,0,1]:
            neig_i = i + ii
            neig_j = j + jj
            #first check if the neighbor is within the box
            if((neig_i < n) and (neig_i > -1) and (neig_j < n) and (neig_j > -1) and not ((neig_i == i) and (neig_j == j))): 
                # check if the output corresponding to the neightbor is 1
                neighbour_dir = neighbourConnectionMap[ii, jj]
                if(new_outs[neighbour_dir]):
                    input_dir_for_the_neighbour = (neighbour_dir + 4) % 8 
                    res.append((neig_i * n + neig_j, input_dir_for_the_neighbour))
    return res

def getNewOutsForCurrent(item, item_dir, ins_cur, outs_cur):
    res = [0,0,0,0,0,0,0,0]

    if item == ITEM.BOMB:
        return res
    elif item == ITEM.EMPTY or item == ITEM.TARGET:
        ins_rotated_by_four = ins_cur[-4:]+ins_cur[:-4]
        # we are only returning new outs so, if it waas already out before then we do  ot return it
        res = [1 if a1 == 1 and a2 != 1 else 0 for a1, a2 in zip(ins_rotated_by_four, outs_cur)]
    elif item == ITEM.MIRROR:
        left_dir = (item_dir - 1) % 8
        right_dir = (item_dir + 1) % 8

        if ins_cur[item_dir] == 1 and outs_cur[item_dir] != 1:
            res[item_dir] = 1

        if ins_cur[left_dir] == 1 and outs_cur[right_dir] != 1:
            res[right_dir] = 1

        if ins_cur[right_dir] == 1 and outs_cur[left_dir] != 1:
            res[left_dir] = 1
    elif item == ITEM.SCATTER:
        left_dir = (item_dir - 3) % 8
        right_dir = (item_dir + 3) % 8

        if ins_cur[item_dir] == 1:
            if outs_cur[right_dir] != 1:
                res[right_dir] = 1
            if outs_cur[left_dir] != 1:
                res[left_dir] = 1

        if (ins_cur[left_dir] == 1 or ins_cur[right_dir] == 1) and outs_cur[item_dir] != 1:
            res[item_dir] = 1
    elif item == ITEM.SOURCE:
        if outs_cur[item_dir] != 1:
            res[item_dir] = 1
    elif item == ITEM.SPLIT:
        left_dir = (item_dir - 2) % 8
        right_dir = (item_dir + 2) % 8

        if ins_cur[item_dir] == 1:
            if outs_cur[right_dir] != 1:
                res[right_dir] = 1
            if outs_cur[left_dir] != 1:
                res[left_dir] = 1
    elif item == ITEM.WALL:
        return res

    return res

def BoardGenerate(items, item_dirs, n):
    ins = [[0] * 8 for _ in range(n * n)]
    outs = [[0] * 8 for _ in range(n * n)]

    source_indices = [index for index, value in enumerate(items) if value == ITEM.SOURCE]

    queue = source_indices
    
    while len(queue) > 0:
        current_item_index = queue.pop(0)
        item = items[current_item_index]
        item_dir = item_dirs[current_item_index]
        ins_cur = ins[current_item_index]
        outs_cur = outs[current_item_index]
        new_outs = getNewOutsForCurrent(item, item_dir.value, ins_cur, outs_cur)
        
        neigs = getNeighboursFromNewOutsAndGetTheirInputs(current_item_index, n, new_outs)
        
        for neig in neigs:
            (neigh_index, neigh_input_dir) = neig
            if neigh_index not in queue:
                queue.append(neigh_index)

            #update ins for the new outs coming from current_item
            ins[neigh_index][neigh_input_dir] = 1

        # update outs for the current_index with new_outs
        updated_cur_out = [1 if a1 == 1 or a2 == 1 else 0 for a1, a2 in zip(new_outs, outs_cur)]
        outs[current_item_index] = updated_cur_out

    return ins, outs

def main():
    n = 3
    #items = [ITEM.EMPTY] * n * n
    #item_dirs = [DIR.TOP] * n * n
    
    #items = [ITEM.EMPTY, ITEM.MIRROR, ITEM.MIRROR, ITEM.EMPTY, ITEM.SOURCE, ITEM.EMPTY, ITEM.BOMB, ITEM.WALL, ITEM.TARGET]
    #item_dirs = [DIR.TOP,DIR.BOTTOM_RIGHT, DIR.BOTTOM_LEFT, DIR.BOTTOM_LEFT,DIR.TOP, DIR.TOP, DIR.TOP, DIR.TOP, DIR.TOP]
    
    items = [ITEM.SOURCE, ITEM.SOURCE, ITEM.TARGET, ITEM.BOMB, ITEM.SPLIT, ITEM.MIRROR, ITEM.WALL, ITEM.TARGET, ITEM.EMPTY]
    item_dirs = [DIR.BOTTOM_RIGHT,DIR.BOTTOM_RIGHT, DIR.BOTTOM_LEFT, DIR.BOTTOM_LEFT,DIR.TOP_LEFT, DIR.LEFT, DIR.TOP, DIR.TOP, DIR.TOP]
    
    #items[94] = ITEM.SOURCE
    ins, outs = BoardGenerate(items, item_dirs, n)

    #for inx in ins:
    #    print(inx)
    #print("---------------------------------")
    #for outx in outs:
    #    print(outx)


main()