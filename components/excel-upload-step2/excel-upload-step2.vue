<template>
  <NFlex justify="center" align="center" vertical>
    <h2>컬럼 연결하기</h2>
    
    <!-- {{  activeNodes  }} -->

    <NLayout class="column-list">
      <NLayoutHeader
        class="column-list__header"
      >
        <div>
          <strong>기준 엑셀 컬럼</strong>
          <strong>업로드된 엑셀 컬럼</strong>
        </div>
        <span>연결된 컬럼</span>
      </NLayoutHeader>
      
      <NLayout
        has-sider
        sider-placement="right"
        position="absolute"
        class="column-list__layout"
      >
        <NLayoutContent
          ref="siderRef"
          content-style="display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 20px; height: 100%;"
          bordered
          :native-scrollbar="false"
        >
          <NGrid class="column-list__grid" x-gap="20" :cols="2">
            <NGi class="column-list__grid-item">
              <NScrollbar class="column-list__scroll">
                <NFlex vertical>
                  <NButton
                    v-for="node in nodes1"
                    :key="node.id"
                    tertiary
                    strong
                    :secondary="isSelected(node)"
                    :type="isConnected(node, 'primary')"
                    @click="handleNodeClickEvent(node)"
                  >
                    {{ node.label }}
                  </NButton>
                </NFlex>
              </NScrollbar>
            </NGi>

            <NGi class="column-list__grid-item">
              <NScrollbar class="column-list__scroll">
                <NFlex vertical>
                  <NButton
                    v-for="node in nodes2"
                    :key="node.id"
                    tertiary
                    strong
                    :secondary="isSelected(node)"
                    :type="isConnected(node, 'info')"
                    @click="handleNodeClickEvent(node)"
                  >
                    <NTag size="small">N</NTag>
                    {{ node.label }}
                  </NButton>
                </NFlex>
              </NScrollbar>
            </NGi>
          </NGrid>
          <!-- /. 업로드된 엑셀 컬럼 -->
        </NLayoutContent>
        <!-- /. 컨텐츠 -->

        <NLayoutSider
          bordered
          width="40%"
          :native-scrollbar="false"
          class="column-list__sider"
        >
          <NFlex vertical>
            <ColumnCard
              v-for="(column, index) in showConnectedStatus()"
              :key="`${index}_pair`"
              :id="Number(column[0])"
              closable
              class="item"
            >
              <p class="item__content">
                <span>{{ column[1] }}</span>
                <b> → </b>
                <span>{{ column[2] }}</span>
              </p>
            </ColumnCard>
          </NFlex>
        </NLayoutSider>
        <!-- /. 연결된 컬럼 -->
      </NLayout>

      <NLayout-footer
        bordered
        position="absolute"
        class="column-list__footer"
      >
        <NH5>옵션 설정</NH5>

        <NCheckbox size="large" label="기준 엑셀 데이터 모두 포함" />
      </NLayout-footer>
    </NLayout>

    <NSpace class="button-area">
      <NButton secondary size="large">
        뒤로가기
      </NButton>
  
      <NButton type="primary" size="large" @click="handleDownloadButtonClickEvent">
        미리보기
      </NButton>
    </NSpace>
  </NFlex>
</template>

<script setup lang="ts">
import { useColumnLinker } from '@/composables/use-column-linker'
import type { Node } from '@/components/link-columns/link-columns.type';
import { NLayout, NLayoutSider, NScrollbar } from 'naive-ui';
import { Close as CloseIcon } from "@vicons/ionicons5"


const { standardColunms, restColunms } = useColumnLinker()

const nodes1 = ref<Node[]>([])
const nodes2 = ref<Node[]>([])

const activeNodes = ref<Node[]>([])
const nodeRefs = ref<{ [key: string]: VNode | null }>({});
// const svgPath = ref<string>(''); // Path 정보를 저장
// const svgRef = ref<SVGSVGElement | null>(null); // SVG 요소에 대한 참조

function setNodeRef2 (el: VNode |null) {

}

function setNodeRef (id: number, el: VNode | null) {
  nodeRefs.value[String(id)] = el;
};

function isSelected (node: Node) {
  return activeNodes.value.includes(node)
}

function isConnected (node: Node, type: string) {
  return node.connected !== undefined ? type : (isSelected(node) ? type : 'tertiary')
}


// const getElementPosition = (el: HTMLElement) => {
//   const rect = el.getBoundingClientRect();
//   return {
//     x: rect.left + window.scrollX,
//     y: rect.top + window.scrollY
//   };
// };

// // SVG 컨테이너의 상대적 좌표를 계산합니다
// const getSVGPosition = (svg: SVGSVGElement) => {
//   const rect = svg.getBoundingClientRect();
//   return {
//     x: rect.left + window.scrollX,
//     y: rect.top + window.scrollY
//   };
// };

// const drawPathBetweenNodes = (node1: Node, node2: Node) => {
//   const node1El = nodeRefs.value[String(node1.id)] as HTMLElement | null;
//   const node2El = nodeRefs.value[String(node2.id)] as HTMLElement | null;
//   const svg = svgRef.value;

//   if (!node1El || !node2El || !svg) return;

//   const node1Pos = getElementPosition(node1El);
//   const node2Pos = getElementPosition(node2El);
//   const svgPos = getSVGPosition(svg);

//   const svgX1 = node1Pos.x - svgPos.x;
//   const svgY1 = node1Pos.y - svgPos.y;
//   const svgX2 = node2Pos.x - svgPos.x;
//   const svgY2 = node2Pos.y - svgPos.y;

//   svgPath.value = `M ${svgX1} ${svgY1} L ${svgX2} ${svgY2}`;
// };

function handleNodeClickEvent (node: Node) {
  // 이미 연결된 노드를 눌렀을 때는 기존 연결 해제
  if (node.connected !== undefined) {
    
    nodes2.value.forEach((n: Node) => {
      if (n.id === node.connected) {
        n.connected = undefined
        node.connected = undefined
      }
    })

    return
  }

  activeNodes.value.push(node)

  if (activeNodes.value.length === 2) {
    activeNodes.value[0].connected = activeNodes.value[1].id
    activeNodes.value[1].connected = activeNodes.value[0].id
    
    // const [node1, node2] = activeNodes.value
    // drawPathBetweenNodes(node1, node2);
    // console.log(node.id,  'd?')

    activeNodes.value = []
  }
}

function showConnectedStatus (): string[][] {
  const result: string[][] = []
  for (const node of nodes1.value) {
    if (node.connected) {
      result.push([
        String(node.id + 1),
        node.label,
        nodes2.value[node.connected].label
      ])
    }
  }

  return result
}

function handleMouseEnterEvent (index: number) {
  
}

function handleDownloadButtonClickEvent () {
  
}

watch(
  () => standardColunms.value,
  (newValue: Node[]) => {
    nodes1.value = newValue
  }
)

watch(
  () => restColunms.value,
  (newValue: Node[]) => {
    nodes2.value = newValue
  }
)
</script>

<style lang="scss" scoped>
$header-height: 64px;
$footer-height: 110px;
$sider-width: 40%;
$content-width: calc(100% - $sider-width + 1px);

.column-list {
  height: 70vh;
  width: 80%;
  border: 1px solid #eee;
  border-radius: 10px;

  &__header {
    height: 64px;
    display: flex;
    border-bottom: 1px solid #eee;
    font-size: 16px;

    > div {
      padding: 0 20px;
      display: flex;
      align-content: center;
      justify-content: center;
      align-items: center;
      gap: 20px;
      border-right: 1px solid #eee;
      box-sizing: border-box;
      flex: 0 0 $content-width;

      > strong {
        height: 100%;
        flex: 1;
        display: flex;
        align-content: center;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }
    }

    > span {
      display: flex;
      align-content: center;
      justify-content: center;
      align-items: center;
      flex: 0 0 $sider-width;
      box-sizing: border-box;
      background-color: #fafafc;
    }
  }

  &__layout {
    top: $header-height;
    bottom: $footer-height;
  }

  &__grid {
    // border: 1px solid blue;
    width: 100%;
    height: 100%;

    &-item {
      box-sizing: border-box;
      height: 100%;
      overflow: hidden;
    }
  }

  &__scroll {
    height: calc(60vh - 330px);
  }

  &__sider {
    padding: 20px;
  }
    
  &__footer {
    padding: 20px;
    height: $footer-height;
  }
}

.item {
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 34px;

  &__index {
    border-right: 1px solid #eee;
    flex: 0 0 25px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafc;
    cursor: pointer;

    > i { display: none; }

    &:hover {
      background-color: #eee;
      > i { display: block; }
      > span { display: none; }
    }
  }

  &__content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1%;

    > span {
      flex: 0 0 45%;
      text-align: center;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

      
    > b {
      text-align: center;
      flex: 0 0 5%;
      color: #18a058;
    }
  }
}

.column-result {
  border: 1px solid red;
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px; padding: 20px
}

.column-area {
  border: 1px solid #d9d9d9;
  flex: 0 0 800px;
  padding: 20px;
}
</style>