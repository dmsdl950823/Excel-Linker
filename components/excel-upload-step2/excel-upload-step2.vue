<template>
  <NFlex justify="center" align="center" vertical>
    <h2>컬럼 연결하기</h2>
    
    <!-- {{  linkedNodeList  }} -->

    <NLayout class="column-list">
      <NLayoutHeader
        class="column-list__header"
      >
        <div>
          <strong>
            기준 엑셀 컬럼

            <NTooltip trigger="hover">
              <template #trigger>
                <NButton circle size="small">
                  <NIcon size="16">
                    <InfoIcon />
                  </NIcon>
                </NButton>
              </template>

              - 해당 칼럼은 고정입니다. <br>
              - 현재는 1:1 매칭만 가능합니다. <br>
              - 컬럼 순서는 기준 엑셀 컬럼의 순서를 따릅니다. <br>
              - 컬럼 병합은 인식할 수 없습니다. <br>
              - 현재는 컬럼의 가장 첫 번째 행을 기준으로 컬렴명을 지정합니다.
            </NTooltip>
          </strong>

          <strong>업로드된 엑셀 컬럼</strong>
        </div>

        <span>
          연결된 컬럼
          <NButton
            circle
            size="small"
            @click="handleRefershLinkButton"
          >
            <NIcon size="16">
              <RefreshIcon />
            </NIcon>
          </NButton>
        </span>
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
                  <ColumnCard
                    v-for="node in primaryNodeList"
                    :key="node.id"
                    :id="node.id + 1"
                    :color="isConnected(node, 'green')"
                    :is-active="isActive(node)"
                    type="button"
                    @click="handleNodeClickEvent(node)"
                  >
                    {{ node.label }}
                    <!-- {{ node.connected }} -->
                  </ColumnCard>
                </NFlex>
              </NScrollbar>
            </NGi>

            <NGi class="column-list__grid-item">
              <NScrollbar class="column-list__scroll">
                <NFlex vertical>
                  <ColumnCard
                    v-for="node in minorNodeList"
                    :key="node.id"
                    :id="node.id + 1"
                    :color="isConnected(node, 'blue')"
                    :is-active="isActive(node)"
                    type="button"
                    @click="handleNodeClickEvent(node)"
                  >
                    {{ node.label }}
                    <!-- {{ node.connected }} -->
                  </ColumnCard>
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
              v-for="column in displayLinkedNodeList"
              :key="`${column.id}_pair`"
              :id="column.id + 1"
              closable
              class="item"
              @close="handleUnlinkButton(column.id)"
            >
              <p class="item__content">
                <span>{{ column.primaryLabel }}</span>
                <NIcon size="16">
                  <LinkIcon />
                </NIcon>
                <span>
                  <NTag size="small" round>
                    {{ column.minorId + 1 }}
                  </NTag>
                  {{ column.minorLabel }}
                </span>
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

        <NCheckbox
          size="large"
          label="기준 엑셀 체크되어있지 않은 헤더 데이터 모두 포함 (기본)"
          disabled
          :checked="option.option1"
        />
        <NCheckbox
          size="large"
          label="기준 엑셀 행 데이터 모두 포함"
          disabled
          :checked="option.option2"
        />
      </NLayout-footer>
    </NLayout>

    <NSpace class="button-area">
      <NButton type="info" size="large" disabled>
        컬럼 저장하기
      </NButton>
      <NButton type="primary" size="large" @click="handleDownloadButtonClickEvent">
        다운로드
      </NButton>
    </NSpace>
  </NFlex>
</template>

<script setup lang="ts">
import { useMessage, type UploadFileInfo } from "naive-ui"
import { useColumnLinker } from '@/composables/use-column-linker'
import type { Node, Row } from '@/components/link-columns/link-columns.type';
import type { ConnectedStatusType, OptionType } from "./excel-upload-step2.type"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import {
  Refresh as RefreshIcon,
  InformationCircleOutline as InfoIcon,
  LinkOutline as LinkIcon
} from "@vicons/ionicons5"


const message = useMessage()
const { primaryColHeaderList, minorColHeaderList, minorRowList, primaryColDataList, minorColDataList } = useColumnLinker()

const primaryNodeList = ref<Node[]>([])
const minorNodeList = ref<Node[]>([])
const linkedNodeList = ref<Node[]>([])

const displayLinkedNodeList = ref<ConnectedStatusType[]>([])
const test = ref<boolean>(true)

const option = ref<OptionType>({
  option1: true,
  option2: false
})

function isConnected (node: Node, color: 'green' | 'blue') {
  return node.connected !== undefined ? color : 'grey'
}

function isActive (node: Node): boolean {
  return linkedNodeList.value.includes(node)
}

function handleNodeClickEvent (node: Node) {
  const nodeList = (node.type === 'primary') ? minorNodeList : primaryNodeList
  
  // 1) 이미 연결된 노드를 눌렀을 때는 기존 연결 해제
  if (node.connected !== undefined) {
    nodeList.value.forEach((n: Node) => {
      if (n.id === node.connected) {
        n.connected = undefined
        node.connected = undefined
      }
    })

    handleFlusLinkedNodeList()
    return
  }

  // 2) 같은 컬럼 타입인 경우 알람 + 선택 해제
  if (
    linkedNodeList.value.length === 1 &&
    linkedNodeList.value[0].type === node.type
  ) {
    handleFlusLinkedNodeList()
    return message.error('같은 종류의 컬럼은 연결할 수 없습니다.')
  }


  linkedNodeList.value.push(node)

  if (linkedNodeList.value.length === 2) {
    linkedNodeList.value[0].connected = linkedNodeList.value[1].id
    linkedNodeList.value[1].connected = linkedNodeList.value[0].id

    linkedNodeList.value = []
  }

  displayLinkedNodeList.value = setDisplayLinkedNodeList()
}

function setDisplayLinkedNodeList (): ConnectedStatusType[] {
  const result: ConnectedStatusType[] = []

  for (const node of primaryNodeList.value) {
    if (node.connected !== undefined) {
      const minor = minorNodeList.value[node.connected]
      const item = Object.assign({
        id: node.id,
        primaryLabel: node.label,
        minorLabel: minor.label,
        minorId: minor.id
      }, {})
      result.push(item)
    }
  }

  return result
}

function handleFlusLinkedNodeList () {
  linkedNodeList.value.forEach((node: Node) => {
    node.connected = undefined
  })

  linkedNodeList.value = []
  displayLinkedNodeList.value = setDisplayLinkedNodeList()
}

function handleRefershLinkButton () {
  // 연결 모두 해제
  primaryNodeList.value.forEach((node: Node) => {
    if (node.connected !== undefined) {
      const minor = minorNodeList.value[node.connected]
      minor.connected = undefined
      node.connected = undefined
    }
  })

  displayLinkedNodeList.value = setDisplayLinkedNodeList()
}

function handleUnlinkButton (id: number) {
  // 연결 모두 해제
  primaryNodeList.value.forEach((node: Node) => {
    if (node.connected !== undefined && node.id == id) {
      const minor = minorNodeList.value[node.connected]
      minor.connected = undefined
      node.connected = undefined
    }
  })

  displayLinkedNodeList.value = setDisplayLinkedNodeList()
}

function handleDownloadButtonClickEvent () {
  const columnHeader: string[] = []
  const minorRows: Row[] = []
  // console.log(minorColDataList.value)

  primaryNodeList.value.map((node: Node) => {
    // 컬럼 / 데이터 값 생성
    const headerItem = primaryColHeaderList.value[node.id]
    columnHeader.push(headerItem.label)
    console.log(node.id, node.connected, headerItem.label)

    const minorCellItem = (node.connected !== undefined) ? minorColDataList.value[node.connected] : []
    minorRows.push(minorCellItem)
  })

  // console.log(columnHeader)
  // console.log(minorRows)

  const minorRowList = minorRows[0].map((_, colIndex) => minorRows.map(row => row[colIndex]))
  // console.log(minorRowList)
  
  const dataArray = [columnHeader, ...minorRowList]
  exportToExcel(dataArray)
}

function exportToExcel (data: string[][]) {
    // 1. 2차원 배열을 워크시트로 변환
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // 2. 새로운 워크북 생성 및 워크시트 추가
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 3. 워크북을 바이너리 데이터로 변환
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // 4. Blob 객체 생성 및 파일 저장
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'example.xlsx');

}

watch(
  () => primaryColHeaderList.value,
  (newValue: Node[]) => {
    primaryNodeList.value = newValue
  }
)

watch(
  () => minorColHeaderList.value,
  (newValue: Node[]) => {
    minorNodeList.value = newValue
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
  &__content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1%;

    > span {
      flex: 0 0 45%;
      text-align: center;
      max-width: 45%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
      
    > i {
      text-align: center;
      flex: 0 0 5%;
      color: #18a058;
    }

    .n-tag {
      font-size: 10px;
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