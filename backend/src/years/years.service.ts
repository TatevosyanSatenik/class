import { Injectable } from '@nestjs/common';

@Injectable()
export class YearsService {
	private years = [
		{
			id: '2024',
			name: '2024',
			groups: [
				{ id: 'group1', name: 'Խումբ 1' },
				{ id: 'group2', name: 'Խումբ 2' },
				{ id: 'group3', name: 'Խումբ 3' }
			]
		},
		{
			id: '2025',
			name: '2025',
			groups: [
				{ id: 'group4', name: 'Խումբ 4' },
				{ id: 'group5', name: 'Խումբ 5' },
				{ id: 'group6', name: 'Խումբ 6' }
			]
		}
	];

	private classGroups = [
		{
			classId: 'cs101',
			groupIds: ['group1', 'group2']
		},
		{
			classId: 'cs201',
			groupIds: ['group3', 'group4']
		},
		{
			classId: 'cs301',
			groupIds: ['group5', 'group6']
		}
	];

	getAllYears() {
		return this.years;
	}

	getYearById(id: string) {
		return this.years.find(year => year.id === id);
	}

	getGroupsByYearId(yearId: string) {
		const year = this.years.find(y => y.id === yearId);
		return year ? year.groups : [];
	}

	getGroupsByClassId(classId: string) {
		const classGroups = this.classGroups.find(cg => cg.classId === classId);

		console.log(classGroups, classId);

		if (!classGroups) {
			return [];
		}

		return classGroups.groupIds.map(groupId => {
			const year = this.years.find(y =>
				y.groups.some(g => g.id === groupId)
			);
			if (year) {
				return year.groups.find(g => g.id === groupId);
			}
			return null;
		}).filter(Boolean);
	}
} 