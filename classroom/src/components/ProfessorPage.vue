<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import QuestionForm from './QuestionForm.vue';
import ProfessorQuestionList from './ProfessorQuestionList.vue';
import YearGroupTree from './YearGroupTree.vue';
import { professorService } from '../services/professor.service';
import type { Subject, Topic, Question, StudentAnswer } from '@/types';


const showForm = ref(false);
const selectedGroups = ref<string[]>([]);
const allYears = ref<any[]>([]);
const years = ref<any[]>([]);
const newAnswers = ref<StudentAnswer[]>([]);
const subjects = ref<Subject[]>([]);
const selectedSubject = ref<Subject | null>(null);
const selectedTopic = ref<Topic | null>(null);

const fetchSubjects = async () => {
  try {
    subjects.value = await professorService.loadSubjects();
    if (subjects.value.length > 0) {
      selectedSubject.value = subjects.value[0];
    }
  } catch (error) {
    console.error('Error fetching subjects:', error);
  }
};

const fetchYears = async () => {
  try {
    const response = await fetch('http://localhost:3000/years');
    allYears.value = await response.json();
    years.value = allYears.value;
  } catch (error) {
    console.error('Error fetching years:', error);
  }
};

const handleGroupsSelect = (groups: string[]) => {
  selectedGroups.value = groups;
  console.log(selectedTopic.value);
};

const handleQuestionSubmit = async (question: Omit<Question, 'id' | 'groupIds' | 'topicIds'>) => {
  if (selectedGroups.value.length === 0) {
    alert('Please select at least one group');
    return;
  }

  if (!selectedTopic.value) {
    alert('Please select a topic');
    return;
  }

  try {
    const questionWithGroups = {
      ...question,
      groupIds: selectedGroups.value,
      topicIds: [selectedTopic.value.id]
    };

    await professorService.createQuestion(questionWithGroups);
    console.log('Question added successfully');
    showForm.value = false;
  } catch (error) {
    console.error('Error adding question:', error);
  }
};

onMounted(async () => {
  await fetchYears();
  await fetchSubjects();
  newAnswers.value = await professorService.getAnswers('');
});

onUnmounted(() => {
  professorService.cleanup();
});
</script>

<template>
  <div class="professor-page">
    <div class="content">
		<div>
			<div class="subject-topic-selector">
        <div class="selector-group">
          <h2>Ընտրել առարկա</h2>
          <select v-model="selectedSubject" @change="selectedTopic = null">
            <option v-for="subject in subjects" :key="subject.id" :value="subject">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="selector-group" v-if="selectedSubject">
          <h2>Ընտրել թեմա</h2>
          <select v-model="selectedTopic">
            <option v-for="topic in selectedSubject.topics" :key="topic.id" :value="topic">
              {{ topic.name }}
            </option>
          </select>
        </div>
      </div>


	  <div class="layout">
        <div class="tree-container">
          <h2>Ընտրել տարին և խումբը</h2>
          <YearGroupTree :years="years" @select-groups="handleGroupsSelect" />
          <div v-if="selectedGroups.length > 0" class="selected-groups">
            <h3>Ընտրել խումբը:</h3>
            <ul>
              <li v-for="groupId in selectedGroups" :key="groupId">
                {{years.flatMap(y => y.groups).find(g => g.id === groupId)?.name}}
              </li>
            </ul>
          </div>
        </div>
		<hr/>
		<div class="header">
        <!-- <h1>Professor Dashboard</h1> -->
        <button class="add-question-btn" @click="showForm = !showForm">
          {{ showForm ? 'Չեղարկել' : 'Ավելացնել հարցումներ' }}
        </button>
      </div>

        <div class="main-content">
          <div v-if="showForm" class="form-container">
            <QuestionForm @submit="handleQuestionSubmit" />
          </div>
          <div class="questions-container">
            <ProfessorQuestionList 
              :groupIds="selectedGroups" 
              :topicId="selectedTopic?.name" 
            />
          </div>
        </div>
      </div>
	 


		</div>
		<div>
			<button class="button1">Հարևանության մատրից</button>
	<table class="table1">
	<tr>
		<th></th>
		<th>Անի (001)</th>
		<th>Կարեն (002)</th>
		<th>Մարի (003)</th>
		<th>Դավիթ (004)</th>
		<th>Նարե  (005)</th>




	</tr>	
	<tr>
		<td>Անի (001)</td>
		<td>0.00</td>
		<td>21.61</td>
		<td>43.69</td>
		<td>18.87</td>
		<td class="td1">3.74</td>
		<!-- <td>Գերազանց</td>	 -->
	</tr>
	<tr>
		<td>Կարեն (002)</td>
		<td>21.61</td>
		<td>0.00</td>
		<td>17.00</td>
		<td class="td2">6.78</td>
		<td>24.09</td>
		<!-- <td>Լավ</td> -->

	</tr>
	<tr>
		<td>Մարի (003)</td>
		<td class="td3">43.69</td>
		<td>17.00</td>
		<td>0.00</td>
		<td>22.07</td>
		<td>46.05</td>
		<!-- <td>Թույլ</td> -->

	</tr>
	<tr>
		<td>Դավիթ (004)</td>
		<td>18.87</td>
		<td class="td2">6.78</td>
		<td>22.07</td>
		<td>0.00</td>
		<td>20.40</td>
		<!-- <td>Բավարար</td> -->

	</tr>
	<tr>
		<td>Նարե  (005)</td>
		<td class="td1">3.74</td>
		<td>24.09</td>
		<td>46.05</td>
		<td>20.40</td>
		<td>0.00</td>
		<!-- <td>Գերազանց</td> -->

	</tr>
	<tr>
	</tr>
	</table>
	<br/> <br><hr>
			<h3>Տվյալների խմբավորում</h3>
			<table>
	<tr>
		<th>Անուն Ազգանուն</th>
		<th>Նախորդ միջին գնահատական (100 միավորից)</th>
		<th>Մասնակցությունների տոկոս</th>
		<th>Նախորդ հարցումների միջին արդյունք</th>
		<th>Ընթացիկ հարցման արդյունք</th>
		<th>Տարբերություն (%)</th>
		<th>Առաջընթացի խմբավորում</th>

		<!-- <th>Առաջընթացի խմբավորում</th> -->

	</tr>
	<tr>
		<td>Անի Մանասյան</td>
		<td>85</td>
		<td>90%</td>
		<td>88</td>
		<td>92</td>
		<td>+4%</td>
		<td class="td1">Գերազանց</td>

		
	</tr>
	<tr>
		<td>Կարեն Սարգսյան</td>
		<td>73</td>
		<td>75%</td>
		<td>70</td>
		<td>75</td>
		<td>+5%</td>
		<td class="td2">Բավարար</td>



	</tr>
	<tr>
		<td>Մարի Դավթյան</td>
		<td>60</td>
		<td>50%</td>
		<td>58</td>
		<td>49</td>
		<td>-9%</td>
		<td class="td3">Թույլ</td>



	</tr>
	<tr>
		<td>Դավիթ Խաչատրյան</td>
		<td>67</td>
		<td>80%</td>
		<td>65</td>
		<td>68</td>
		<td>+3%</td>
		<td class="td2">Բավարար</td>



	</tr>
	<tr>
		<td>Նարե Մովսեսյան</td>
		<td>90</td>
		<td>95%</td>
		<td>91</td>
		<td>89</td>
		<td>-2%</td>
		<td class="td1">Գերազանց</td>



	</tr>
	</table>
	<br/>
	<hr/>
	
	
		</div>
      

      

      <div class="new-answers-section" v-if="newAnswers.length > 0">
        <h3>Ուսանողների պատասխաններ</h3>
        <div v-for="answer in newAnswers" :key="answer.timestamp" class="answer-card">
          <div class="answer-header">
            <span class="student-email">{{ answer.email }}</span>
            <span class="answer-time">{{ new Date(answer.timestamp).toLocaleTimeString() }}</span>
          </div>
          <div class="answer-content">
            <template v-if="answer.answer.type === 'quiz'">
              <p>Selected answer: {{ answer.answer.answerId }}</p>
              <p :class="{ 'correct': answer.status === 'correct', 'incorrect': answer.status === 'incorrect' }">
                {{ answer.status === 'correct' ? 'Correct' : (answer.status === 'incorrect' ? 'Incorrect' : 'Invalid') }}
              </p>
            </template>
            <template v-else>
              <p>Text answer:</p>
              <p class="text-answer">{{ answer.answer.text }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.td3{
	background-color: #f8d7da;
}
.td2{
	background-color: #fff3cd;
}
.td1{
	background-color:#d1e7dd;
	
}
.button1 {
	/* background-color: rgb(141, 168, 232); */
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
.table1 {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 60%;
}
table {
  font-family: arial;
  border-collapse: collapse;
  width: 80%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}


.professor-page {
  width: 80%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  /* margin-top: 5px; */
  
}

h1 {
  color: #225dca;
  margin: 0;
}

.add-question-btn {
  background-color: #225dca;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.add-question-btn:hover {
  background-color: #1a4ba3;
}

.content {
  display: grid;
  gap: 30px;
}

.layout {
  /* display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px; */
}

.tree-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tree-container h2 {
  margin-top: 0;
  color: #225dca;
  margin-bottom: 20px;
}

.selected-groups {
  margin-top: 20px;
  padding: 10px;
  background: #f0f7ff;
  border-radius: 4px;
}

.selected-groups h3 {
  color: #225dca;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.selected-groups ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.selected-groups li {
  padding: 4px 0;
  color: #225dca;
}

.main-content {
  display: grid;
  gap: 30px;
}

.form-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.questions-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.class-selector {
  margin-bottom: 20px;
}

.class-selector select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}

.class-selector h2 {
  color: #225dca;
  margin-bottom: 10px;
}

.new-answers-section {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.answer-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.answer-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.answer-content {
  margin-top: 0.5rem;
}

.correct {
  color: #28a745;
  font-weight: bold;
}

.incorrect {
  color: #dc3545;
  font-weight: bold;
}

.text-answer {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.subject-topic-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.selector-group {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selector-group h2 {
  color: #225dca;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.selector-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}
</style>